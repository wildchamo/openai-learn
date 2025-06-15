import OpenAI from 'openai';
export const handleChat = async (request: Request, env: Env) => {
	const openaiClient = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
	});

	const chatCompletion = await openaiClient.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [{ role: 'user', content: 'What is a neuron?' }],
		max_tokens: 100,
	});

	const response = chatCompletion.choices[0].message.content;
	return new Response(JSON.stringify(response), { status: 200 });
};
