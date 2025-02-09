const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const paths = {
  output: path.resolve(__dirname, '../../dist'),
  public: '/',
  staticFiles: 'public',
};

const getConfig = environment => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader', options: { cacheDirectory: true } }],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/img',
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: paths.output,
    publicPath: paths.public,
  },
  plugins: [
    // Copy public files (except index.html) to output
    new CopyWebpackPlugin([
      { from: paths.staticFiles, ignore: ['index.html'] },
    ]),

    // Generate index.html with asset paths injected
    new HtmlWebpackPlugin({
      template: path.resolve(paths.staticFiles, 'index.html'),
      templateParameters: { NODE_ENV: environment },
    }),
  ],
});

module.exports = {
  getConfig,
  paths,
};
