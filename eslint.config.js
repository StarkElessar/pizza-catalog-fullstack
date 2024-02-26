import { resolve } from 'node:path';
import globals from 'globals';
import typescriptParser from '@typescript-eslint/parser';
//! migrate to flat config
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
    baseDirectory: resolve(),
    resolvePluginsRelativeTo: resolve(),
});
//!--------------------------

export default [
    ...compat.extends('airbnb-base'),
    {
        languageOptions: {
            parser: typescriptParser,
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        rules: {
            'import/extensions': ['error', { js: 'always' }],
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
            'import/prefer-default-export': 'off',
            'no-restricted-syntax': 'off',
            'prefer-promise-reject-errors': 'off',
            indent: ['error', 4],
            'max-len': ['error', { code: 140 }],
	        'lines-between-class-members': [
		        "error",
		        {
			        enforce: [
				        {
							blankLine: "always",
					        prev: "method",
					        next: "method"
						}
			        ]
		        },
	        ]
        },
    },
];
