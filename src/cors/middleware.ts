// Función para agregar headers CORS
export function corsHeaders(origin?: string) {
	const allowedOrigins = [
		'http://localhost:3000',
		'https://localhost:3000',
		// Puedes agregar más orígenes aquí
	];

	const corsOrigin = origin && allowedOrigins.includes(origin) ? origin : 'http://localhost:3000';

	return {
		'Access-Control-Allow-Origin': corsOrigin,
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Max-Age': '86400',
	};
}

// Middleware para manejar CORS
export function corsMiddleware(request: Request) {
	const origin = request.headers.get('Origin');

	// Manejar preflight requests (OPTIONS)
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: corsHeaders(origin || undefined),
		});
	}

	return null; // Continuar con la siguiente ruta
}