import { config } from 'dotenv';
import { resolve } from 'node:path';

export class ConfigService {
    #config;
    #logger;

    constructor({ logger }) {
        this.#logger = logger;

        const result = config({ path: resolve(`.env.${process.env.NODE_ENV}`) });

        if (result.error) {
            this.#logger.error('[ConfigService]: Не удалось прочитать .env или он отсутствует');
            return;
        }

        this.#config = result.parsed;
        this.#logger.log('[ConfigService]: Конфигурация .env успешно загружена');
    }

    get(key) {
        return this.#config[key];
    }
}
