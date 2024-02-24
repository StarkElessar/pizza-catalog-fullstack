export class UsersRepository {
	#databaseService;

	constructor({ databaseService }) {
		this.#databaseService = databaseService;
	}

	async getAll() {
		return new Promise((resolve, reject) => {
			this.#databaseService.db.all(`SELECT * FROM users`, (err, rows) => {
				if (err) {
					reject({ message: 'Не удалось получить пользователей', error: err });
				} else {
					resolve({ data: rows });
				}
			});
		});
	}

	async create({ username, email }) {
		return new Promise((resolve, reject) => {
			this.#databaseService.db.run('INSERT INTO users (username, email) VALUES (?, ?)', [username, email], function(err) {
				if (err) {
					reject({ message: 'Ошибка при сохранении данных', error: err});
				}

				resolve({ message: 'Пользователь успешно сохранен', data: this.lastID});
			});
		});
	}
}