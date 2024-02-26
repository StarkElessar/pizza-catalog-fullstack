export class ProductRepository {
    #databaseService;

    constructor({ databaseService }) {
        this.#databaseService = databaseService;
    }

    async getAll() {
        return new Promise((resolve, reject) => {
            this.#databaseService.db.all('SELECT * FROM products', (error, rows) => {
                if (error) {
                    reject({
                        message: 'Не удалось получить товары',
                        error,
                    });
                } else {
                    resolve({ data: rows });
                }
            });
        });
    }

    async create({ name, description, cost }) {
        return new Promise((resolve, reject) => {
            this.#databaseService.db.run(
                'INSERT INTO products (name, description, cost) VALUES (?, ?, ?)',
                [name, description, cost],
                function (error) {
                    if (error) {
                        reject({ message: 'Ошибка при сохранении данных', error });
                    }

                    resolve({
                        message: 'Пользователь успешно сохранен',
                        data: this.lastID,
                    });
                },
            );
        });
    }
}
