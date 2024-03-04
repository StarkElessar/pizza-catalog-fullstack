import { config } from 'dotenv';
import { resolve } from 'node:path';

export class ConfigService {
    #config;
    #logger;

    constructor({ logger }) {
        this.#logger = logger;

		const envPath = resolve(`.env.${process.env.NODE_ENV}`);
        const result = config({ path: envPath });

        if (result.error) {
            this.#logger.error(`[ConfigService]: Не удалось прочитать ${envPath} или он отсутствует`);
			process.exit(1);
            return;
        }

        this.#config = result.parsed;
        this.#logger.log('[ConfigService]: Конфигурация .env успешно загружена');
    }

    get(key) {
        return this.#config[key];
    }
}
