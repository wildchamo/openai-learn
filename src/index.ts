/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Router } from 'itty-router';
import { handleChatLearning } from './handler/chat';
import { handleImages } from './handler/images';
import { handleProjectChat } from './handler/project-chat';
import { handleChatFunctionLearning } from './handler/chat-tools';
import { corsMiddleware, corsHeaders } from './cors/middleware';
import { retrieveImages } from './handler/retrieve-image';

const router = Router();


router
	.all('*', corsMiddleware) // Aplicar CORS a todas las rutas
	.get('/:key+', retrieveImages)
	.get('/chat', handleChatLearning)
	.get('/chat-function', handleChatFunctionLearning)
	.get('/images', handleImages)
	.post("/api/chat", handleProjectChat)
	.get("*", () => new Response("Not found", { status: 404 }));

export default {
	async fetch(request, env: Env, ctx): Promise<Response> {

		const copyRequest = request.clone();

		console.log(await copyRequest.json())
		const response = await router.fetch(request, env);

		// Agregar headers CORS a la respuesta
		const origin = request.headers.get('Origin');
		const corsHeadersObj = corsHeaders(origin || undefined);

		Object.entries(corsHeadersObj).forEach(([key, value]) => {
			response.headers.set(key, value);
		});

		return response;
	},
} satisfies ExportedHandler<Env>;
