import { HttpError } from '../../utils/http-error.js';

export class ExceptionFilter {
	#logger;

	constructor(logger) {
		this.#logger = logger;
	}

	async catch(err, req, res) {
		if (err instanceof HttpError) {
			this.#logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`)
			return res.status(err.statusCode).json({
				message: err.message,
				errors: err.errors
			});
		}

		this.#logger.error(`${err.message}`);
		res.status(500).json({ message: err.message });
	}
}