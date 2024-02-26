export class HttpError extends Error {
    constructor(statusCode, message, context, errors = []) {
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
        return new HttpError(401, 'Ошибка авторизации', context);
    }

    static noAccess(context) {
        return new HttpError(403, 'Нет доступа', context);
    }

    static internal(context, message) {
        return new HttpError(500, message, context);
    }

    static unprocessableEntity(context, message = 'Ошибка при валидации', errors = []) {
        return new HttpError(422, message, errors, context);
    }
}
