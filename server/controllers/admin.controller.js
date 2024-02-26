import { BaseController } from './base.controller.js';

export class AdminController extends BaseController {
    #productRepository;

    constructor({ logger, productRepository }) {
        super(logger);

        this.#productRepository = productRepository;

        this.bindRoutes([
            {
                path: '/',
                method: 'get',
                func: this.index,
            },
        ]);
    }

    async index(req, res, next) {
        try {
            const result = await this.#productRepository.getAll();
            console.log(result);
            res.render('pages/admin', {
                title: 'Admin panel',
                links: [
                    { name: 'Home Page', link: '/' },
                ],
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}
