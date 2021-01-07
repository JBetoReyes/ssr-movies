const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const baseConfig = require('./webpack.config.js');

const config = {
  ...merge(baseConfig, {
    mode: 'production',
    output: {
      path: path.resolve(__dirname, 'src/server/public'),
      filename: 'assets/app.js',
    },
    plugins: [
      new CompressionWebpackPlugin({
        test: /\.jsx?$|\.s?css$/,
        filename: '[path][base].gz',
      }),
      new MiniCssExtractPlugin({
        filename: 'app.css',
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [new TerserWebpackPlugin()],
    },
  }),
};
module.exports = config;
