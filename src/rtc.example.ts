import { WorkerEntrypoint } from "cloudflare:workers";

export default class WorkerB extends WorkerEntrypoint {


	async add(a: number, b: number) {
		console.log(a, b);
		return a + b;
	}

}