/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');
/* eslint-enable import/no-extraneous-dependencies */

exports.devServer = function devServer(options) {
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works.
      historyApiFallback: true,

      // Unlike the `--hot` CLI flag, this doesn't set
      // HotModuleReplacementPlugin
      hot: true,

      // Don't refresh if hot loading fails. If you want
      // refresh behavior, set inline: true instead
      hotOnly: true,

      // Display only errors to reduce the amount of output
      stats: 'errors-only',

      // Parse host and port from env to allow customization
      host: options.host, // Default to localhost
      port: options.port, // Default to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in large projects.
      new webpack.HotModuleReplacementPlugin({
        // Disabled as this won't work with html-webpack-template yet
        // multiStep: true
      }),
    ],
  };
};

exports.lintJavaScript = function lintJavaScript(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths,
          use: 'eslint-loader',
          enforce: 'pre',
        },
      ],
    },
  };
};

exports.loadCSS = function loadCSS(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.(scss|sass)$/,
          // Third style-loader deals with `require` statements
          // in our JavaScript.
          use: ['style-loader'],
          include: paths,
        },
        {
          test: /\.(scss|sass)$/,
          // Second css-loader will resolve `@import` and `url` statements
          // in CSS files.
          use: ['css-loader'],
          include: paths,
        },
        {
          test: /\.(scss|sass)$/,
          // First fast-sass-loader will compile SASS to CSS
          use: ['sass-loader'],
          include: paths,
        },
      ],
    },
  };
};

exports.extractCSS = function extractCSS(paths) {
  return {
    module: {
      rules: [
        // Extract CSS during build
        {
          test: /\.(scss|sass|css)$/,
          include: paths,
          loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader',
          }),
        },
        {
          test: /\.(scss|sass)$/,
          use: ['sass-loader'],
          include: paths,
        },
      ],
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].css'),
    ],
  };
};

exports.purifyCSS = function purifyCSS(paths) {
  const pathsParameter = Array.isArray(paths) ? paths : [paths];

  return {
    plugins: [
      new PurifyCSSPlugin({
        // Our paths are absolute so Purify needs patching
        // against that to work
        basePath: '/',

        // `paths` is used to point PurifyCSS to files
        // not visible to Webpack. This expects glob
        // patterns as we adapt here.
        paths: pathsParameter.map(path => `${path}/*`),

        purifyOptions: {
          minify: true,
        },

        // Walk through only html files within node_modules.
        // It picks up .js files by default.
        resolveExtensions: ['.html'],
      }),
    ],
  };
};
