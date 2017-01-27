/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const glob = require('glob'); // eslint-disable-line

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const merge = require('webpack-merge');
/* eslint-enable import/no-extraneous-dependencies */

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  // The other way is use import './main.scss' from index.js
  images: path.join(__dirname, 'app', 'static', 'images'),
};

const stylelintRules = {
  // TODO add more rules
  'color-hex-case': 'lower',
  'scss/operator-no-unspaced': true,
};

const common = merge(
  {
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack initial',
        // TODO add html-webpack-favicon and custom template with yandex map script
        // TODO it's also possible to add webpack-dashboard later
      }),
      new CaseSensitivePathsPlugin(),
    ],
  },
  parts.lintCSS(PATHS.app, stylelintRules),
  parts.lintJavaScript(PATHS.app),
  parts.loadImages(PATHS.images),
  parts.loadFonts(),
  parts.loadJavaScript(PATHS.app),
);

module.exports = function config(env) { // eslint-disable-line no-unused-vars
  if (env === 'production') {
    return merge(
      common,
      {
        output: {
          chunkFilename: 'scripts/[chunkhash].js',
          filename: 'scripts/[name]_[chunkhash].js',
          // The line below in necessary if SPA will be served not from root level
          // domain. It's also necessary for CSS source maps to work.
          // TODO change to parse process.env.HOST and process.env.PORT
          publicPath: '/webpack2_config/build/', // WebStorm built-in server
        },

        plugins: [
          new webpack.HashedModuleIdsPlugin(),
        ],
        // TODO records.json need for aggressiveSplittingPlugin for HTTP/2 agnostic build
        // TODO It will be used later for es-next build (without Babel) for modern browsers
        // TODO modern or not will be determined by nginx
        // recordsPath: 'records.json',
      },
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production',
      ),
      parts.clean(PATHS.build),
      parts.minifyJavaScript({ useSourceMap: true }),
      parts.extractBundles(
        [
          {
            name: 'vendor',
            minChunks: function isVendor(module) {
              const userRequest = module.userRequest;

              // You can perform other similar checks here too.
              // Now we check just node_modules.
              return userRequest && userRequest.indexOf('node_modules') >= 0;
            },
          },
          {
            name: 'manifest',
          },
        ],
      ),
      parts.generateSourcemaps('source-map'),
      parts.extractCSS(),
      parts.purifyCSS({
        // `paths` is used to point PurifyCSS to files
        // not visible to Webpack. This expects glob
        // patterns as we adapt here.
        paths: {
          app: glob.sync(`${PATHS.app}/*`),
        },
        // PurifyCSS options
        purifyOptions: {
          minify: true, // Uses clean-css internally
        },
      }),
    );
  }

  return merge(
    common,
    {
      output: {
        filename: '[name].js',
        publicPath: 'http://localhost:8080/',
      },
      // Disable performance hints during development
      performance: {
        hints: false,
      },
      plugins: [
        new webpack.NamedModulesPlugin(),
      ],
    },
    // Currently (15 Jan 2017) eval-prefixed options for sourcemaps don't work in Chrome if
    // `debugger;` statement or dev-tools breakpoints are used.
    parts.generateSourcemaps('eval-source-map'),
    parts.loadCSS(),
    parts.devServer({
      // Customize host/port here if needed
      host: process.env.HOST,
      port: process.env.PORT,
    }),
  );
};
