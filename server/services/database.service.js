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
		await this.#createMigrationsTableIfExists();
		const migrationsResult = await this.#executeQuery('SELECT * FROM migrations');
		await this.#applyMigrations(migrationsResult);
    }

	async #applyMigrations(migrationsData) {
		const migrationDir = resolve('migrations');

		try {
			const files = await readdir(migrationDir);

			for (const file of files) {
				const existsRecordIndex = migrationsData.findIndex(({ file_name }) => file_name === file);

				if (existsRecordIndex !== -1) {
					this.#logger.log(`[DatabaseService] ${file} эта миграция уже была применена`);
					return;
				}

				const migrationFile = resolve(migrationDir, file);
				const migrationScript = await readFile(migrationFile, 'utf8');

				await this.#executeMigration(migrationScript);
				this.#db.run('INSERT INTO migrations (file_name) VALUES (?)', [file], function(error) {
					if (error) {
						console.log({ error })
					} else {
						console.log({ lastID: this.lastID, changes: this.changes })
					}
				});
			}
		} catch (error) {
			this.#logger.error('[DatabaseService] Ошибка при применении миграций:', error);
		}
	}

	async #createMigrationsTableIfExists() {
		// SQL запрос для проверки существования таблицы и получения записей
		return this.#executeQuery(`
	        CREATE TABLE IF NOT EXISTS migrations
	        (
	            id INTEGER PRIMARY KEY AUTOINCREMENT,
	            file_name TEXT NOT NULL,
	            date DATE DEFAULT CURRENT_TIMESTAMP
	        );
		`);
	}

	#executeQuery(query) {
		return new Promise((resolve, reject) => {
			// Выполняем запрос
			this.#db.serialize(() => {
				this.#db.all(query, (error, rows) => {
					if (error) reject(error)
					resolve(rows);
				});
			});
		});
	}

	async #executeMigration(migrationScript) {
		return new Promise((resolve, reject) => {
			this.#db.exec(migrationScript, (error) => {
				if (error) reject({ message: 'Произошла ошибка при накатывании миграций', error});

				resolve();
			});
		});
	}

    get db() {
        return this.#db;
    }
}
