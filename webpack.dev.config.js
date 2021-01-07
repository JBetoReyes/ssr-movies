const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const baseConfig = require('./webpack.config.js');

const config = {
  ...merge(baseConfig, {
    entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true'],
    output: {
      filename: 'assets/app.js',
    },
    mode: 'development',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: 'assets/app.css',
      }),
    ],
  }),
};

module.exports = config;
