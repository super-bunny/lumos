const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const { version } = require('./package.json')

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

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new SentryWebpackPlugin({
      org: 'lumos-app',
      project: 'lumos-app',
      // Specify the directory containing build artifacts
      include: './.webpack/',
      urlPrefix: '~/.webpack/',
      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and needs the `project:releases` and `org:read` scopes
      authToken: process.env.SENTRY_AUTH_TOKEN,
      // Optionally uncomment the line below to override automatic release name detection
      release: version,
      cleanArtifacts: true,
    }),
  )
}

if (process.env.OPEN_ANALYZER === 'true') {
  plugins.push(new BundleAnalyzerPlugin())
}

module.exports = plugins