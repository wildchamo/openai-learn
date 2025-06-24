import OpenAI from 'openai';


export const batch = async (request: Request, env: Env) => {

	const openaiClient = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
	});



}
