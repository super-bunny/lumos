process.env.NODE_ENV = process.env.NODE_ENV || 'production'

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
  externals: {
    'ddc-rs': 'commonjs2 ddc-rs',
  },
};
