/**
 * PUT /images
 * -------------
 * Cuerpo esperado:
 * - multipart/form-data con un campo "file" (File)
 *   o bien el cuerpo binario (image/*) directamente.
 *
 * Almacena la imagen en el bucket `ai_images_bucket` y responde con un JSON
 * `{ id, url }`, donde `url` apunta a este mismo Worker.
 */
export async function uploadImage(request: Request, env: Env) {

	const contentType = request.headers.get('content-type') || 'application/octet-stream';

	// Leer el cuerpo como ArrayBuffer
	const data = await request.arrayBuffer();
	if (!data.byteLength) {
		return new Response(JSON.stringify({ error: 'Empty body' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
		});
	}

	// Generar nombre único manteniendo extensión
	const ext = contentType.split('/')[1] ?? 'bin';
	const id = `${crypto.randomUUID()}.${ext}`;

	await env.ai_images_bucket.put(id, data, {
		httpMetadata: { contentType },
	});

	const url = new URL(request.url);
	url.pathname = `/${id}`;

	return new Response(JSON.stringify({ id, url: url.toString() }), {
		status: 201,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
	});
}
