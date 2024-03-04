import { BaseController } from './base.controller.js';

export class UsersController extends BaseController {
    #configService;
    #usersRepository;

    constructor({ configService, usersRepository, logger }) {
        super(logger);

        this.#configService = configService;
        this.#usersRepository = usersRepository;

        this.bindRoutes([
            {
                path: '/',
                method: 'get',
                func: this.getAll,
            },
            {
                path: '/',
                method: 'post',
                func: this.create,
            },
        ]);
    }

    async getAll(req, res, next) {
        try {
            const result = await this.#usersRepository.getAll();
            res.status(200).json({ data: result });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { username, email } = req.body;

            await this.#usersRepository.create({ username, email });
            res.status(201).json({ message: 'Пользователь успешно сохранен' });
        } catch (error) {
            next(error);
        }
    }
}
