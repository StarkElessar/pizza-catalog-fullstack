import sqlite from 'sqlite3';
import { resolve } from 'node:path';

import { App } from './app.js';
import { HomeController, UsersController } from './controllers/index.js';
import { DatabaseService, LoggerService, ConfigService } from './services/index.js';
import { ProductRepository, UsersRepository } from './repositories/index.js';
import { ExceptionFilter } from './middlewares/exeption-filter.js';
import { AdminController } from './controllers/admin.controller.js';

function bootstrap() {
    const logFilePath = resolve('logs.txt');

    const loggerService = new LoggerService(logFilePath);
    const configService = new ConfigService({ logger: loggerService });
    const databaseService = new DatabaseService({ sqlite, logger: loggerService });
    const usersRepository = new UsersRepository({ databaseService });
    const productRepository = new ProductRepository({ databaseService });

    const app = new App({
        logger: loggerService,
        databaseService,
        configService,
        exceptionFilter: new ExceptionFilter(loggerService),
        homeController: new HomeController({ configService, usersRepository, logger: loggerService }),
        usersController: new UsersController({ configService, usersRepository, logger: loggerService }),
	    adminController: new AdminController({ productRepository, logger: loggerService }),
    });

    app.init();
}

bootstrap();
