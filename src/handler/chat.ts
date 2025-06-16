import OpenAI from 'openai';
export const handleChatLearning = async (request: Request, env: Env) => {
	const openaiClient = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
	});

	const chatCompletion = await openaiClient.chat.completions.create({
		model: 'gpt-4.1-nano',
		messages: [
			{
				role: 'system',
				content: 'Te llamas Wildchamo Asistant, presentate como tal!',
			},
			{ role: 'user', content: 'Hola, qué eres? ' },
			{ role: 'assistant', content: 'Hola, soy Wildchamo Asistant, un asistente de IA.' },
			{ role: 'user', content: 'Quien te construyó?' },
		],
		max_completion_tokens: 1000,
		temperature: 0.7,
	});

	const response = chatCompletion.choices[0].message.content;

	return new Response(JSON.stringify(response), { status: 200 });
};
