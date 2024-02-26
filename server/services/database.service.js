import { resolve } from 'node:path';

export class DatabaseService {
    #db;
    #logger;

    constructor({ logger, sqlite }) {
        this.#logger = logger;

        sqlite.verbose();
        this.#db = new sqlite.Database(resolve('database.sqlite'));
    }

    connect() {
        this.#db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT)', () => {
            this.#logger.log('[DatabaseService] Таблица users была успешно создана');
        });
    }

    get db() {
        return this.#db;
    }
}
