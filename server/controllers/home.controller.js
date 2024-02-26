import { BaseController } from './base.controller.js';

export class HomeController extends BaseController {
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
                func: this.index,
                middlewares: [],
            },
        ]);
    }

    async index(req, res) {
        try {
            const users = await this.#usersRepository.getAll();

            res.render('pages/index', {
                language: 'ru',
                title: 'Настройка приложения. Старт!',
                users: users.data,
            });
        } catch (error) {
            console.log('Ошибка в контроллере: HomeController.index', error);
            res.render('pages/404');
        }
    }
}
