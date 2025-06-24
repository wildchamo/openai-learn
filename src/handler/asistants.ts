import OpenAI from 'openai';


export const handleAsistantsCall = async (request: Request, env: Env) => {
	const openaiClient = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
	});

	const assistantId = "asst_C41VSerCvsIQRMHa44DDCfKp"

	const thread = await openaiClient.beta.threads.create();


	const message = await openaiClient.beta.threads.messages.create(
		thread.id, {
		role: "user",
		content: "¿Cuanto es 16284 + 991893 - 771939 * 12456? Ejecuta esta operación en codigo en Python"
	}
	)

	console.log("ejectuando el asistente")


	const run = await openaiClient.beta.threads.runs.createAndPoll(
		thread.id,
		{
			assistant_id: assistantId,
			instructions: "Please address the user as Jane Doe. The user has a premium account.",
		}
	)

	if (run.status === 'completed') {
		const messages = await openaiClient.beta.threads.messages.list(
			run.thread_id
		);

		for (const message of messages.data.reverse()) {
			console.log(message.content)
			console.log(`${message.role} > ${message.content}`);
		}
	} else {
		console.log(run.status);
	}
}
