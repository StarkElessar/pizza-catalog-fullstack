export class UsersRepository {
    #databaseService;

    constructor({ databaseService }) {
        this.#databaseService = databaseService;
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            this.#databaseService.db.all('SELECT * FROM users', (error, rows) => {
                if (error) {
                    reject({ message: 'Не удалось получить пользователей', error });
                } else {
                    resolve({ data: rows });
                }
            });
        });
    }

    async create({ username, email }) {
        return new Promise((resolve, reject) => {
	        this.#databaseService.db.run('INSERT INTO users (username, email) VALUES (?, ?)', [username, email], function (error) {
	            if (error) {
	                reject({ message: 'Ошибка при сохранении данных', error });
	            }

	            resolve({ message: 'Пользователь успешно сохранен', data: this.lastID });
	        });
        });
    }
}
