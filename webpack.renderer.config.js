const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')
const rendererPlugins = require('./webpack.renderer.plugins')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  },
  {
    test: /\.(ttf|eot|woff|woff2)$/,
    type: 'asset/resource',
  },
)

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
