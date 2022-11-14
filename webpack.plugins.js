const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const plugins = [
  new ForkTsCheckerWebpackPlugin(),
  new ReactRefreshWebpackPlugin(),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'src/shared/assets'),
        to: path.resolve(__dirname, '.webpack/shared/assets'),
      },
    ],
  }),
]

if (process.env.OPEN_ANALYZER === 'true') {
  plugins.push(new BundleAnalyzerPlugin())
}

module.exports = plugins