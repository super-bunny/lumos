const webpack = require('webpack')

const plugins = [
  new webpack.DefinePlugin({
    'process.env.ENABLE_SENTRY': JSON.stringify(process.env.ENABLE_SENTRY ?? true),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
  }),
]

module.exports = plugins