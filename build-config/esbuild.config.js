import ESBuild from 'esbuild';
import chalk from 'chalk';
import getConfig from './config.js';

(async (isDev) => {
	const config = getConfig(isDev);

	try {
		if (isDev) {
			const context = await ESBuild.context(config);

			await context.watch();
			console.log(chalk.green("⚡️ Build complete! ⚡️\nОтслеживание успешно включено!"))
		} else {
			await ESBuild.build(config);
			console.log(chalk.green("⚡️ Build complete! ⚡️"))
		}
	} catch {
		console.log(chalk.red('Что то пошло не так.. 🤔'));
		process.exit(1);
	}
})(process.argv.includes('--development'));