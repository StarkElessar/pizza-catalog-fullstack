export default {
    overrides: [
        {
            files: ['*.js', '*.ts', '*.yaml'],
            options: {
                singleQuote: true,
                semi: true,
	            bracketSpacing: true,
	            arrowParens: 'always',
            },
        },
        {
            files: ['*.json'],
            options: {
                trailingComma: 'none',
            },
        },
    ],
};
