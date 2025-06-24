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
import {
	corsMiddleware
} from './cors/middleware';
import { retrieveImages } from './handler/retrieve-image';
import { uploadImage } from './handler/upload-image';
import { imageGen } from './handler/image-gen';
import { handleAsistantsCall } from './handler/asistants';



const router = Router();

router
	.all('/api/*', corsMiddleware) // CORS primero para API paths
	.post('/api/chat', handleProjectChat)
	.put('/api/images', uploadImage)
	.get('/chat', handleChatLearning)
	.get('/chat-function', handleChatFunctionLearning)
	.get('/images', handleImages)
	.get('/image-gen', imageGen)
	.get('/assistants', handleAsistantsCall)
	.get('/:key+', retrieveImages)
	.get("*", () => new Response("Not found", { status: 404 }));

export default {
	async fetch(request, env: Env, ctx): Promise<Response> {
		const response = await router.fetch(request, env);
		return response;
	},
} satisfies ExportedHandler<Env>;
