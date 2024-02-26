import { resolve } from 'node:path';
import express from 'express';
import morgan from 'morgan';

export class App {
    #logger;
    #homeController;
    #usersController;
    #adminController;
    #databaseService;
    #configService;
    #exceptionFilter;

    constructor({
        logger,
        homeController,
        usersController,
	    adminController,
        databaseService,
        configService,
        exceptionFilter,
    }) {
        this.#logger = logger;
        this.#homeController = homeController;
        this.#usersController = usersController;
        this.#adminController = adminController;
        this.#databaseService = databaseService;
        this.#configService = configService;
        this.#exceptionFilter = exceptionFilter;

        this.app = express();
        this.port = this.#configService.get('PORT') || 4000;
        this.host = this.#configService.get('HOST') || 'localhost';
    }

    useMiddlewares() {
        this.app.set('view engine', 'pug');
        this.app.set('views', resolve('views'));

        this.app.use(morgan('dev'));
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use(express.static(resolve('public')));
    }

    useRoutes() {
        this.app.use('/', this.#homeController.router);
        this.app.use('/admin', this.#adminController.router);
        this.app.use('/api/users', this.#usersController.router);
    }

    useExceptionFilters() {
        this.app.use(this.#exceptionFilter.catch.bind(this.#exceptionFilter));
    }

    async init() {
        this.useMiddlewares();
        this.useRoutes();
        this.useExceptionFilters();

        this.#databaseService.connect();

        this.server = this.app.listen(this.port, this.host, null, () => {
            this.#logger.log(`[App] Сервер запущен по адресу: http://localhost:${this.port}`);
        });
        this.server.maxConnections = 10_000;
    }
}
