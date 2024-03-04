import { resolve } from 'node:path';

export class BaseDatabaseService {
	#dbContext;

	constructor(logger, sqlite) {
		const path = resolve('database.sqlite');
		// Открываем соединение с базой данных
		this.#dbContext = new sqlite.Database(path, (error) => {
			if (error) {
				logger.error(`[BaseDatabaseService] Ошибка при подключении к БД.`, error.message);
				return;
			}

			logger.log(`[BaseDatabaseService] Успешное подключение к БД`);
		});
	}

	getAll(sql) {
		return new Promise((promiseResolve, reject) => {
			this.#dbContext.all(sql, (err, rows) => {
				if (err) {
					reject(err);
					return;
				}

				promiseResolve(rows.length ? rows : null);
			});
		});
	}

	get db() {
		return this.#dbContext;
	}
}
