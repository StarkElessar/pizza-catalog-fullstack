import { Router } from 'express';

export class BaseController {
	#router;
	#logger;

	constructor(logger) {
		this.#logger = logger;
		this.#router = Router();
	}

	get router() {
		return this.#router;
	}

	bindRoutes(routes) {
		for (const route of routes) {
			const handler = route.func.bind(this);
			const middlewares = route.middlewares?.map(m => m.execute.bind(m));
			const pipeline = middlewares ? [...middlewares, handler] : handler;

			this.#router[route.method](route.path, pipeline);
			this.#logger.log(`[${this.constructor.name}]: ${route.method.toUpperCase()} = ${route.path}`);
		}
	}
}