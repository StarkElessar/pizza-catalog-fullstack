import { resolve } from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { BaseDatabaseService } from './base-database.service.js';

export class DatabaseService extends BaseDatabaseService {
    #logger;

    constructor({ logger, sqlite }) {
		super(logger, sqlite);

        this.#logger = logger;
    }

    async connect() {
	    let migrationsResult = [];

		try {
	        migrationsResult = await this.#getMigrationRecords();
		} catch (err) {
			console.log(err);
			this.#logger.warn('[DatabaseService] Таблица migrations отстутствует в БД.', err.message);
		} finally {
	        await this.#applyMigrations(migrationsResult);
		}
    }

	close() {
		return new Promise((promiseResolve, reject) => {
			this.db.close((error) => {
				if (error) {
					this.#logger.error(`[DatabaseService] Произошла ошибка при закрытии подключения к БД`, error.message);
					reject(error);
				}

				this.#logger.log(`[DatabaseService] Подключение к БД закрыто`);
				promiseResolve();
			});
		});
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
            this.#logger.error('[DatabaseService] Ошибка при применении миграций.', error.message);
        }
    }

    async #applyMigrationsAndInsertRecord(migrationDir, file) {
        const migrationFile = resolve(migrationDir, file);
        const migrationScript = await readFile(migrationFile, 'utf8');

        await this.#executeMigration(migrationScript);

        return new Promise((promiseResolve, reject) => {
            this.db.run('INSERT INTO migrations (file_name) VALUES (?)', [file], function (error) {
                if (error) {
                    reject(error);
                } else {
                    promiseResolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }

    #getMigrationRecords() {
        return new Promise((promiseResolve, reject) => {
	        this.db.all('SELECT * FROM migrations', (error, rows) => {
		        if (error) reject(error);
		        promiseResolve(rows);
	        });
        });
    }

    #executeMigration(migrationScript) {
        return new Promise((promiseResolve, reject) => {
            this.db.exec(migrationScript, (error) => {
                if (error) reject(error);

                promiseResolve();
            });
        });
    }
}
