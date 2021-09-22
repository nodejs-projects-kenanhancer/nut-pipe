const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: './src/index.js'
  },
  resolve: {
    extensions: ['.mjs', '.json', '.ts', '.yml'],
    symlinks: false,
    cacheWithContext: false,
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    sourceMapFilename: 'index.js.map',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.webpack')
          ]
        ],
        options: {
          transpileOnly: false
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src", to: './' },
      ],
    })
  ],
};