export class HttpError extends Error {
	constructor(statusCode, message, errors = [], context) {
		super(message);

		this.statusCode = statusCode;
		this.message = message;
		this.errors = errors;
		this.context = context;
	}

	static badRequest(message, errors = []) {
		return new HttpError(400, message, errors);
	}

	static unAuthorizedError(context) {
		return new HttpError(401, 'Ошибка авторизации', [], context);
	};

	static noAccess() {
		return new HttpError(403, 'Нет доступа');
	};

	static internal(message) {
		return new HttpError(500, message);
	};

	static unprocessableEntity(context, message = 'Ошибка при валидации', errors = []) {
		return new HttpError(422, message, errors, context);
	};
}