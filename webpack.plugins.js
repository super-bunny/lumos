const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const plugins = [
  new ForkTsCheckerWebpackPlugin(),
  new ReactRefreshWebpackPlugin(),
]

if (process.env.OPEN_ANALYZER === 'true') {
  plugins.push(new BundleAnalyzerPlugin())
}

module.exports = plugins