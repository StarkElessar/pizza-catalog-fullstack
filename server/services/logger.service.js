import { Logger } from 'tslog';
import { existsSync, writeFileSync } from 'node:fs';
import { appendFile } from 'node:fs/promises';
import { loggerLevel } from '../../utils/constants.js';

export class LoggerService {
    constructor(pathToLogFile) {
        this.logFilePath = pathToLogFile;

        this.logger = new Logger({
            stylePrettyLogs: true,
            type: 'pretty',
            prettyLogTimeZone: 'local',
        });
    }

    log(...args) {
        this.#logToFile(loggerLevel.INFO, args);
    }

    error(...args) {
        this.#logToFile(loggerLevel.ERROR, args);
    }

    warn(...args) {
        this.#logToFile(loggerLevel.WARN, args);
    }

    async #logToFile(level, args) {
        const timestamp = new Date().toLocaleString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${args.join(' ')}`;

        this.logger[level](...args);

        if (!existsSync(this.logFilePath)) {
            writeFileSync(this.logFilePath, '');
        }

        try {
            await appendFile(this.logFilePath, `${logMessage}\n`);
        } catch (error) {
            this.logger.error(`[${new Date().toLocaleTimeString('ru')}] Ошибка при записи лога в файл: `, error);
        }
    }
}
