import OpenAI from 'openai';
export const handleChatLearning = async (request: Request, env: Env) => {
	try {
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

		const response = chatCompletion.choices[0].message.content || 'No response';

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error in handleChatLearning:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
