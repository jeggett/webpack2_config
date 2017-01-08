module.exports = {
  plugins: {
    stylelint: {
      plugins: [
        'stylelint-scss',
      ],
      rules: {
        // TODO add more rules
        'color-hex-case': 'lower',
        'scss/operator-no-unspaced': true,
      },
      ignoreFiles: 'node_modules/**/*.css',
    },
  },
};
