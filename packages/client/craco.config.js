/* eslint-disable no-param-reassign */
const CracoSwcPlugin = require('craco-swc');

/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');

const absolutePath = path.join(__dirname, '../common');
module.exports = {
  plugins: [
    {
      plugin: {
        ...CracoSwcPlugin,
        overrideCracoConfig: ({ cracoConfig }) => {
          if (typeof cracoConfig.eslint.enable !== 'undefined') {
            cracoConfig.disableEslint = !cracoConfig.eslint.enable;
          }
          delete cracoConfig.eslint;
          return cracoConfig;
        },
        overrideWebpackConfig: ({ webpackConfig, cracoConfig }) => {
          if (
            typeof cracoConfig.disableEslint !== 'undefined' &&
            cracoConfig.disableEslint === true
          ) {
            webpackConfig.plugins = webpackConfig.plugins.filter(
              (instance) => instance.constructor.name !== 'ESLintWebpackPlugin'
            );
          }
          return webpackConfig;
        }
      },
      options: {
        swcLoaderOptions: {
          jsc: {
            externalHelpers: true,
            target: 'esnext',
            parser: {
              syntax: 'typescript',
              tsx: true,
              dynamicImport: true,
              exportDefaultFrom: true
            }
          }
        }
      }
    }
  ],

  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  },
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, { env, paths }) => {
      const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'));
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat([absolutePath]);
      }
      return webpackConfig;
    }
  }
};
