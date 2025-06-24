import OpenAI from 'openai';

export const handleTextToSpeech = async (request: Request, env: Env) => {
	try {
		const openaiClient = new OpenAI({
			apiKey: env.OPENAI_API_KEY,
		});

		const response = await openaiClient.audio.speech.create({
			model: "gpt-4o-mini-tts",
			voice: "alloy",
			input: 'hola leña, como va ese supabase?',
		})

		const buffer = await response.arrayBuffer()

		return new Response(buffer, {
			status: 200,
			headers: { 'Content-Type': 'audio/mp3' }
		});
	} catch (error) {
		console.error('Error in handleChatLearning:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
