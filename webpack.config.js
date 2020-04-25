const packageJson = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');

const isDevelopmentEnv = process.env.NODE_ENV === 'development';
const publicPath = isDevelopmentEnv ? '/' : '/';
const BASE_URL_LOADER = 'url-loader?prefix=fonts/&name=[name].[hash:8].[ext]&limit=10000';

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: true,
    minimize: true,
    importLoaders: 1,
  },
};
const miniCssExtractLoader = {
  loader: MiniCssExtractPlugin.loader,
};

module.exports = {
  devtool: isDevelopmentEnv ? 'cheap-module-source-map' : 'source-map',
  stats: true,
  entry: ['babel-polyfill', './lib/client/app/'],
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: isDevelopmentEnv ? '[name].js' : '[name].[chunkhash].js',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'lib/client/app/')],
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [miniCssExtractLoader, cssLoader],
      },
      {
        test: /\.scss$/,
        use: [miniCssExtractLoader, cssLoader, 'sass-loader'],
      },
      {
        test: /\.woff(\?.*)?$/,
        use: `${BASE_URL_LOADER}&mimetype=application/font-woff`,
      },
      {
        test: /\.woff2(\?.*)?$/,
        use: `${BASE_URL_LOADER}&mimetype=application/font-woff2`,
      },
      {
        test: /\.otf(\?.*)?$/,
        use:
          'file-loader?prefix=fonts/&name=[name].[hash:8].[ext]&limit=10000&mimetype=font/opentype',
      },
      {
        test: /\.ttf(\?.*)?$/,
        use: `${BASE_URL_LOADER}&mimetype=application/octet-stream`,
      },
      {
        test: /\.eot(\?.*)?$/,
        use: 'file-loader?prefix=fonts/&name=[name].[hash:8].[ext]',
      },
      {
        test: /\.svg(\?.*)?$/,
        use: `${BASE_URL_LOADER}&mimetype=image/svg+xml`,
      },
      {
        test: /\.gif(\?.*)?$/,
        use: 'file-loader?name=[name].[hash:8].[ext]',
      },
      {
        test: /\.(png|jpg)$/,
        use: 'url-loader?limit=8192',
      },
    ],
  },
  devServer: {
    port: process.env.PORT || 8088,
    historyApiFallback: {
      index: publicPath,
    },
  },
  plugins: [
    /*
     * Generates a solid base html page for your web application with all your webpack
     * generated css and js files built in.
     */
    new HtmlWebpackPlugin({
      favicon: path.resolve(__dirname, './lib/client/static/assets/images/', 'favicon.ico'),
      template: path.resolve(__dirname, './lib/client/static/templates/', 'index.html'),
      chunksSortMode: 'dependency',
      inject: true,
    }),
    new CopyWebpackPlugin([
      {
        context: path.resolve(__dirname, './lib/client/static/assets/', 'images/'),
        from: '*',
        to: path.resolve(__dirname, './build/', 'images/'),
      },
      {
        context: path.resolve(__dirname, './lib/client/static/assets/', 'fonts/'),
        from: '*',
        to: path.resolve(__dirname, './build/', 'fonts/'),
      },
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
    /*
     * Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
     * inside your code for any environment checks; UglifyJS will automatically
     * drop any unreachable code.
     */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        VERSION: JSON.stringify(packageJson.version),
      },
    }),
  ],
};
