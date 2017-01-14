/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
// const glob = require('glob');

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

const common = merge(
  {
    entry: {
      app: PATHS.app,
      // images: PATHS.images,
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack initial',
        // add html-webpack-favicon and custom template with yandex map api
        // it's also possible to add webpack-dashboard later
      }),
      new CaseSensitivePathsPlugin(),
    ],
  },
  parts.lintCSS(PATHS.app),
  parts.lintJavaScript(PATHS.app),
  parts.loadImages(PATHS.images));

module.exports = function config(env) { // eslint-disable-line no-unused-vars
  if (env === 'production') {
    return merge(
      common,
      parts.extractCSS(),
      parts.purifyCSS(PATHS.app));
  }

  return merge(
    common,
    {
      // Disable performance hints during development
      performance: {
        hints: false,
      },
      plugins: [
        new webpack.NamedModulesPlugin(),
      ],
    },
    parts.loadCSS(),
    parts.devServer({
      // Customize host/port here if needed
      host: process.env.HOST,
      port: process.env.PORT,
    }));
};
