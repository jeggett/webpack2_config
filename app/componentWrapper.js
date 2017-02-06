if (process.env.NODE_ENV === 'production') {
  module.exports = require('./component.prod'); // eslint-disable-line
} else {
  module.exports = require('./component.dev'); // eslint-disable-line
}
