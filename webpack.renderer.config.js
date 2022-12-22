const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')
const rendererPlugins = require('./webpack.renderer.plugins')

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
  plugins: [
    ...plugins,
    ...rendererPlugins,
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
}
