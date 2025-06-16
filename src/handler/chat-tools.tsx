import OpenAI from 'openai';
import { getWeather } from '../tools/weather';

export const handleChatFunctionLearning = async (request: Request, env: Env) => {
	const openaiClient = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
	});

	// 1. Iniciar la conversación con el mensaje del usuario y las funciones disponibles
	const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
		{
			role: 'system',
			content:
				'Eres Wildchamo Assistant, un asistente especializado en información meteorológica. Envias datos sobre el clima en el mundo real, no puedes inventar datos. Usa las funciones disponibles para obtener la información.',
		},
		{ role: 'user', content: 'Hola, qué tiempo hace en Madrid?' },
	];

	let response = await openaiClient.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: messages,
		tools: functions,
		tool_choice: 'auto',
	});

	let responseMessage = response.choices[0].message;

	const toolCalls = responseMessage.tool_calls;

	// // 2. Comprobar si OpenAI quiere llamar a una función
	if (toolCalls) {
		// Añadir la respuesta del asistente a la lista de mensajes
		messages.push(responseMessage);

		// 3. Iterar sobre cada llamada a función que pida OpenAI
		for (const toolCall of toolCalls) {
			if (toolCall.function.name === 'getWeather') {
				// 4. Ejecutar la función local
				const args = JSON.parse(toolCall.function.arguments);
				const functionResponse = await getWeather({ latitude: args.latitude, longitude: args.longitude });

				// 5. Añadir el resultado de la función a la lista de mensajes
				messages.push({
					tool_call_id: toolCall.id,
					role: 'tool',
					content: JSON.stringify(functionResponse),
				});
			}
		}

		// 6. Enviar el resultado de la función de vuelta a OpenAI para obtener una respuesta final
		const finalResponse = await openaiClient.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: messages,
		});

		responseMessage = finalResponse.choices[0].message;
	}

	return new Response(JSON.stringify(responseMessage.content), {
		headers: { 'Content-Type': 'application/json' },
		status: 200,
	});
};

const functions: OpenAI.Chat.Completions.ChatCompletionTool[] = [
	{
		type: 'function',
		function: {
			name: 'getWeather',
			description: 'Usa esta función para obtener el clima actual en un lugar específico',
			parameters: {
				type: 'object',
				properties: {
					latitude: {
						type: 'number',
						description: 'La latitud del lugar. Por ejemplo, para Madrid es 40.4168',
					},
					longitude: {
						type: 'number',
						description: 'La longitud del lugar. Por ejemplo, para Madrid es -3.7038',
					},
				},
				required: ['latitude', 'longitude'],
			},
		},
	},
];
