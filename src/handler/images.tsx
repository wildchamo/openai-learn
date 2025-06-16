import OpenAI from 'openai';
export const handleImages = async (request: Request, env: Env) => {
	const openaiClient = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
	});

	const chatCompletion = await openaiClient.chat.completions.create({
		model: 'gpt-4.1-nano',
		messages: [
			{
				role: 'system',
				content: 'Eres un sistema que analiza imagenes a gran detalle!',
			},
			{
				role: 'user',
				content: [
					{
						type: 'image_url',
						image_url: { url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png' },
					},
					{
						type: 'text',
						text: 'Dime que ves en la imagen? cuantas letras hay? ',
					},
				],
			},
		],
		max_completion_tokens: 1000,
		temperature: 0.7,
	});

	const response = chatCompletion.choices[0].message.content;

	return new Response(JSON.stringify(response), { status: 200 });
};
