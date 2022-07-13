const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
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
