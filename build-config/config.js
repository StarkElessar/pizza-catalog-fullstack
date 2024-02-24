import { resolve } from 'node:path';
import { sassPlugin } from 'esbuild-sass-plugin';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import combineMediaQueries from 'postcss-combine-media-query';
import { cleanFolder } from './plugins/clean-folder.js';

export default function config(isDev) {
	return {
		outdir: resolve('public'),
		entryPoints: [
			resolve('client/styles/main.scss'),
			resolve('client/js/main.js')
		],
		bundle: true,
		metafile: true,
		minify: !isDev,
		sourcemap: isDev,
		charset: 'utf8',
		plugins: [
			cleanFolder,
			sassPlugin({
				async transform(source) {
					const { css } = await postcss([autoprefixer, combineMediaQueries]).process(source, {
						from: undefined
					});
					return css;
				},
			}),
			{
				name: 'ignore-assets',
				setup(build) {
					build.onResolve({ filter: /\.(svg|png|jpe?g|gif|woff|woff2)$/ }, (args) => {
						return {
							path: args.path,
							external: true
						};
					});
				},
			},
		],
		legalComments: isDev ? 'eof': 'none',
		drop: isDev ? [] : ['console', 'debugger'],
		//-----------optimisation-----------
		assetNames: 'assets/[name]-[hash]',
		chunkNames : 'chunks/[name]-[hash]',
		//---------optimisation:beta--------
		format: 'esm',
		splitting: true,
	}
}