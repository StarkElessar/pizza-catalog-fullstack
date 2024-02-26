import { resolve } from 'node:path';
import { sassPlugin } from 'esbuild-sass-plugin';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import combineMediaQueries from 'postcss-combine-media-query';
import cleanFolder from './plugins/clean-folder.js';

export default (isDevelopment) => ({
    outdir: resolve('public'),
    entryPoints: [
        resolve('client/styles/main.scss'),
        resolve('client/js/main.js'),
    ],
    bundle: true,
    metafile: true,
    minify: !isDevelopment,
    sourcemap: isDevelopment,
    charset: 'utf8',
    plugins: [
        cleanFolder,
        sassPlugin({
            async transform(source) {
                const { css } = await postcss([autoprefixer, combineMediaQueries]).process(source, {
                    from: undefined,
                });
                return css;
            },
        }),
        {
            name: 'ignore-assets',
            setup(build) {
                build.onResolve({ filter: /\.(svg|png|jpe?g|gif|woff|woff2)$/ }, (arguments_) => ({
                    path: arguments_.path,
                    external: true,
                }));
            },
        },
    ],
    legalComments: isDevelopment ? 'eof' : 'none',
    drop: isDevelopment ? [] : ['console', 'debugger'],
    // -----------optimisation-----------
    assetNames: 'assets/[name]-[hash]',
    chunkNames: 'chunks/[name]-[hash]',
    // ---------optimisation:beta--------
    format: 'esm',
    splitting: true,
});
