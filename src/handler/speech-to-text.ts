// import OpenAI from 'openai';


// export const handleSpeechToText = async (request: Request, env: Env) => {
// 	try {
// 		const openaiClient = new OpenAI({
// 			apiKey: env.OPENAI_API_KEY,
// 		});

// 		const response = await openaiClient.audio.transcriptions.create({

// 			// file: "",
// 			// model: "whisper-1",
// 		})


// 		return new Response(JSON.stringify(response), {
// 			status: 200,
// 			headers: { 'Content-Type': 'application/json' }
// 		});
// 	} catch (error) {
// 		console.error('Error in handleChatLearning:', error);
// 		return new Response(JSON.stringify({ error: 'Internal server error' }), {
// 			status: 500,
// 			headers: { 'Content-Type': 'application/json' }
// 		});
// 	}
// };
