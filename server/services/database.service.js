import { resolve } from 'node:path';
import { readdir, readFile } from 'node:fs/promises';

export class DatabaseService {
    #db;
    #logger;

    constructor({ logger, sqlite }) {
        this.#logger = logger;

        sqlite.verbose();
	    // Открываем соединение с базой данных
        this.#db = new sqlite.Database(resolve('database.sqlite'));
    }

    async connect() {
	    let migrationsResult = [];

		try {
	        migrationsResult = await this.#executeQuery('SELECT * FROM migrations');
		} catch (err) {} finally {
	        await this.#applyMigrations(migrationsResult);
		}
    }

    async #applyMigrations(migrationsData) {
        const migrationDir = resolve('migrations');
        const promises = [];

        try {
            const files = await readdir(migrationDir);

            for (const file of files) {
                const existsRecordIndex = migrationsData.findIndex(({ file_name }) => file_name === file);

                if (existsRecordIndex !== -1) {
                    this.#logger.log(`[DatabaseService] ${file} эта миграция уже была применена`);
                    continue;
                }

                promises.push(this.#applyMigrationsAndInsertRecord(migrationDir, file));
            }

            await Promise.all(promises);
        } catch (error) {
            this.#logger.error('[DatabaseService] Ошибка при применении миграций:', error);
        }
    }

    async #applyMigrationsAndInsertRecord(migrationDir, file) {
        const migrationFile = resolve(migrationDir, file);
        const migrationScript = await readFile(migrationFile, 'utf8');

        await this.#executeMigration(migrationScript);

        return new Promise((promiseResolve, reject) => {
            this.#db.run('INSERT INTO migrations (file_name) VALUES (?)', [file], function (error) {
                if (error) {
                    reject(error);
                } else {
                    promiseResolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }

    #executeQuery(query) {
        return new Promise((promiseResolve, reject) => {
            // Выполняем запрос
            this.#db.serialize(() => {
                this.#db.all(query, (error, rows) => {
                    if (error) reject(error);
                    promiseResolve(rows);
                });
            });
        });
    }

    async #executeMigration(migrationScript) {
        return new Promise((promiseResolve, reject) => {
            this.#db.exec(migrationScript, (error) => {
                if (error) reject({ message: 'Произошла ошибка при накатывании миграций', error });

                promiseResolve();
            });
        });
    }

    get db() {
        return this.#db;
    }
}
