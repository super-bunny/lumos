const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new ReactRefreshWebpackPlugin(),
  new BundleAnalyzerPlugin({
    openAnalyzer: process.env.OPEN_ANALYZER === 'true',
  }),
]
