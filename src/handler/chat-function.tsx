import OpenAI from 'openai';
export const handleChatFunctionLearning = async (request: Request, env: Env) => {
	const openaiClient = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
	});

	const chatCompletion = await openaiClient.chat.completions.create({
		model: 'gpt-4.1-nano',
		messages: [
			{
				role: 'system',
				content:
					'Eres Wildchamo Assistant, un asistente especializado en información meteorológica. Envias datos sobre el clima en el mundo real, no puedes inventar datos.',
			},
			{ role: 'user', content: 'Hola, qué tiempo hace en Madrid?' },
		],
		max_completion_tokens: 1000,
		temperature: 0.7,
	});

	const response = chatCompletion.choices[0].message.content;

	return new Response(JSON.stringify(response), { status: 200 });
};
