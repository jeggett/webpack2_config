const webpack = require('webpack');

exports.devServer = function (options) {
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
      port: options.port // Default to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in large projects.
      new webpack.HotModuleReplacementPlugin({
        // Disabled as this won't work with html-webpack-template yet
        // multiStep: true
      })
    ]
  }
};

exports.lintJavaScript = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths,
          use: 'eslint-loader',
          enforce: 'pre'
        }
      ]
    }
  }
};