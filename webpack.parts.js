/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');
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

exports.lintCSS = function lintCSS(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.(scss|css)/,
          include: paths,
          use: 'postcss-loader',
          enforce: 'pre',
        },
      ],
    },
  };
};

exports.loadImages = function loadImages(paths) {
  return {
    module: {
      rules: [
        // {
        //   test: /\.(jpe?g|png|svg)$/,
        //   loader: 'file-loader',
        //   include: paths,
        //   options: {
        //     name: '[name].[ext]',
        //   },
        // },
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

exports.extractBundles = function extractBundles(bundles, options) {
  const entry = {};
  const names = [];

  bundles.forEach(({ name, entries }) => {
    if (entries) {
      entry[name] = entries;
    }

    names.push(name);
  });

  return {
    // Define an entry point needed for splitting
    entry,
    plugins: [
      // Extract bundles,
      new webpack.optimize.CommonsChunkPlugin(
        Object.assign(
          {},
          options,
          {
            names,
            minChunks: (module) => {
              const userRequest = module.userRequest;

              // You can perform other similar checks here too.
              // Now we check just node_modules.
              return userRequest && userRequest.indexOf('node_modules') >= 0;
            },
          } // eslint-disable-line comma-dangle
        ) // eslint-disable-line comma-dangle
      ),
    ],
  };
};

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
            // custom, pass a path to it. I.e. { cachedirectory: '<path>' }
            cacheDirectory: true,
          },
        },
      ],
    },
  };
};

exports.clean = function clean(path) {
  return {
    plugin: [
      new CleanWebpackPlugin([path]),
    ],
  };
};
