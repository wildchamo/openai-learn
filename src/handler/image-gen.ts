import OpenAI from 'openai';


export const imageGen = async (request: Request, env: Env) => {
	const openaiClient = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
	});


	const response = await openaiClient.images.generate({
		model: "dall-e-3",
		prompt: "draw to man friends hugging each other in Medellin, Colombia. no gay plis ",
		quality: "hd",
	});


	console.log(response);

	return new Response(JSON.stringify(response), { status: 200 });
};
