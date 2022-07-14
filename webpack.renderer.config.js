const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')

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
  target: 'electron-renderer',
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    fallback: { 'path': require.resolve('path-browserify') },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  externals: {
    'ddc-rs': 'commonjs2 ddc-rs',
  },
}
