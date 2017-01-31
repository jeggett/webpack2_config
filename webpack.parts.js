/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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
          test: /\.(scss|sass|css)$/,
          // Third style-loader deals with `require` statements
          // in our JavaScript.
          use: [
            {
              loader: 'style-loader',
            },
          ],
          include: paths,
        },
        {
          test: /\.(scss|sass|css)$/,
          // Second css-loader will resolve `@import` and `url` statements
          // in CSS files.
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                // TODO: Enable css-modules later.
              },
            },
          ],
          include: paths,
        },
        {
          test: /\.(scss|sass)$/,
          // First fast-sass-loader will compile SASS to CSS.
          use: [
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
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
          use: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: ['css-loader?sourceMap', 'sass-loader?sourceMap'],
          }),
        },
      ],
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name]_[contenthash].css'),
    ],
  };
};

exports.purifyCSS = function purifyCSS(options) {
  return {
    plugins: [
      new PurifyCSSPlugin(options),
    ],
  };
};

exports.lintCSS = function lintCSS(paths, rules) {
  return {
    module: {
      rules: [
        {
          test: /\.(scss|css)/,
          include: paths,
          enforce: 'pre',
          use: {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('stylelint')({ // eslint-disable-line
                  plugins: [
                    'stylelint-scss',
                  ],
                  rules,
                  ignoreFiles: 'node_modules/**/*.css',
                }),
              ],
            },
          },
        },
      ],
    },
  };
};

exports.loadImages = function loadImages(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.(jpe?g|png|svg)$/,
          loader: 'url-loader',
          include: paths,
          options: {
            limit: 3000,
            name: './images/[name][hash].[ext]',
          },
        },
        {
          test: /\.(jpe?g|png|svg)$/,
          loader: 'image-webpack-loader',
          include: paths,
          // TODO configure rules later
          options: {
            progressive: true,
            optimizationLevel: 8,
            interlaced: false,
            pngquant: {
              quality: '65-90',
              speed: 3,
            },
          },
        },
        // TODO add resize-image-loader and responsive-loader for srcset
        // TODO to support ultra high dpi displays better
      ],
    },
  };
};

exports.loadFonts = function loadFonts(options) {
  const name = (options && options.name) || 'fonts/[hash].[ext]';
  const limit = (options && options.limit) || 50000;
  return {
    module: {
      rules: [
        {
          test: /\.(ttf|svg|eot)$/,
          loader: 'file-loader',
          options: {
            name,
          },
        },
        {
          test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url-loader',
          options: {
            name,
            limit, // If font is less than limit, embed it to bundle.
            mimetype: 'application/font-woff',
          },
        },
      ],
    },
  };
};

exports.generateSourcemaps = function generateSourcemaps(type) {
  return {
    devtool: type,
  };
};

exports.extractBundles = bundles => (
  {
    plugins: bundles.map(
      bundle => new webpack.optimize.CommonsChunkPlugin(bundle),
    ),
  }
);

exports.loadJavaScript = function loadJavaScript(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths,
          loader: 'babel-loader',
          options: {
            // Enable caching for improved performance during development.
            // It uses default OS dir by default. If you need something more
            // custom, pass a path to it. I.e. { cacheDirectory: '<path>' }
            cacheDirectory: true,
          },
        },
      ],
    },
  };
};

exports.clean = function clean(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path]),
    ],
  };
};

exports.minifyJavaScript = function minifyJavaScript({ useSourceMap }) {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: useSourceMap,
        compress: {
          warnings: false,
          drop_console: true,
        },
        comments: false,
        mangle: {
          except: ['webpackJsonp'],
          screw_ie8: true,
          keep_fnames: true,
        },
      }),
    ],
  };
};

exports.setFreeVariable = function setFreeVariable(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env),
    ],
  };
};
