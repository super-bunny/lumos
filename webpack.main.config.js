const plugins = require('./webpack.plugins')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

module.exports = {
  devtool: 'source-map',
  entry: './src/index.ts',
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  plugins,
}
