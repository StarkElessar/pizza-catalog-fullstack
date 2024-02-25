export default {
    overrides: [
        {
            files: ['*.js', '*.ts', '*.yaml'],
            options: {
                singleQuote: true,
                semi: true,
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
