import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import chalk from 'chalk';

export const cleanFolder = {
	name: 'clean-folder',

	setup: (build) => {
		build.onStart(async () => {
			const { outdir } = build.initialOptions;

			if (outdir && existsSync(outdir)) {
				try {
					await Promise.all([
						rm(join(outdir, 'js'), { recursive: true }),
						rm(join(outdir, 'styles'), { recursive: true })
					]);

					console.log(chalk.green(`[${new Date().toLocaleTimeString('ru')}] Старые файлы были удалены. 😁`));
				} catch (error) {
					console.log(chalk.red(`[${new Date().toLocaleTimeString('ru')}] Ошибка при удалении файлов: 🤔\n${error}`));
				}
			}
		});

		build.onEnd(() => {
			console.log(chalk.green(`[${new Date().toLocaleTimeString('ru')}] Файлы были пересобраны. ☄️`));
		});
	}
};