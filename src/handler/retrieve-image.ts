export async function retrieveImages(request: Request, env: Env) {

	const url = new URL(request.url);

	const key = url.pathname.slice(1);

	const object = await env.ai_images_bucket.get(key);


	if (object === null) {
		return new Response('Object Not Found', {
			status: 404,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});
	}
	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set('etag', object.httpEtag);
	headers.set('Access-Control-Allow-Origin', '*');

	return new Response(object.body, {
		headers,
	});
}
