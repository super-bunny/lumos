const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
})

rules.push({
  test: /\.(ttf|eot|woff|woff2)$/,
  loader: 'file-loader',
  options: {
    name: 'fonts/[name].[ext]',
  },
})

module.exports = {
  devtool: 'source-map',
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
}
