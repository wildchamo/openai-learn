import OpenAI from 'openai';

type ContentPart =
	| { type: 'text'; text: string }
	| { type: 'image_url'; image_url: { url: string } };

interface RequestBody {
	messages: Array<{
		role: 'user' | 'assistant' | 'system';
		content: string;
		image_data?: string[]
	}>;
}

async function prepareMessages(body: RequestBody) {
	const formattedMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string | ContentPart[] }> = [
		{
			role: 'system',
			content: 'Te llamas Tiny, eres un mentor especializado en emprendimiento y coaching. Tienes amplia experiencia ayudando a emprendedores a desarrollar sus ideas de negocio, superar obstáculos, definir estrategias de crecimiento y alcanzar sus metas. Tu enfoque es práctico, motivador y siempre buscas empoderar a las personas para que tomen acción. Compartes conocimientos sobre liderazgo, desarrollo personal, validación de ideas, modelos de negocio, marketing, ventas y mentalidad emprendedora. Eres directo pero empático, y siempre ofreces consejos accionables.',
		},
	];
	for (const message of body.messages) {
		formattedMessages.push({
			role: message.role,
			content: message.content,
		});

	}

	console.log(formattedMessages);
	return formattedMessages;
}

async function streamOpenAIResponse(chatCompletion: AsyncIterable<any>) {
	const encoder = new TextEncoder();
	return new ReadableStream({
		async start(controller) {
			try {
				for await (const chunk of chatCompletion) {
					const content = chunk.choices[0]?.delta?.content || '';
					const stop = chunk.choices[0]?.finish_reason === 'stop';

					if (content) {
						const data = `data: ${JSON.stringify({ content })}\n\n`;
						controller.enqueue(encoder.encode(data));
					}

					if (stop) {
						const endData = `data: [DONE]\n\n`;
						controller.enqueue(encoder.encode(endData));
						controller.close();
						break;
					}
				}
			} catch (error) {
				console.error('Error streaming:', error);
				controller.error(error);
			}
		}
	});
}

export const handleProjectChat = async (request: Request, env: Env) => {
	const body = await request.json() as RequestBody;
	const { OPENAI_API_KEY } = env
	const formattedMessages = await prepareMessages(body);


	try {
		const openaiClient = new OpenAI({
			apiKey: OPENAI_API_KEY,
		});

		const chatCompletion = await openaiClient.chat.completions.create({
			model: 'gpt-4.1-nano',
			messages: formattedMessages as OpenAI.ChatCompletionMessageParam[],
			max_tokens: 1000,
			temperature: 0.7,
			stream: true,
		});

		const stream = await streamOpenAIResponse(chatCompletion);


		return new Response(stream, {
			status: 200,
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
				'Access-Control-Allow-Origin': '*',
			},
		});
	} catch (error) {
		console.error('Error in handleChatLearning:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}
}
