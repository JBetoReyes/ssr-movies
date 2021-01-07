const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const baseConfig = require('./webpack.config.js');

const config = {
  ...merge(baseConfig, {
    mode: 'production',
    output: {
      path: path.resolve(__dirname, 'src/server/public'),
      filename: 'assets/app-[hash].js',
    },
    plugins: [
      new CompressionWebpackPlugin({
        test: /\.jsx?$|\.css$/,
        filename: '[path][base].gz',
      }),
      new MiniCssExtractPlugin({
        filename: 'assets/app-[hash].css',
      }),
      new WebpackManifestPlugin(),
    ],
    optimization: {
      minimize: true,
      minimizer: [new TerserWebpackPlugin()],
      splitChunks: {
        chunks: 'async',
        name: true,
        cacheGroups: {
          vendors: {
            name: 'vendors',
            chunks: 'all',
            reuseExistingChunk: true,
            priority: 1,
            filename: 'assets/vendor-[hash].js',
            enforce: true,
            test: (modules, chunks) => {
              const name = modules.nameForCondition && modules.nameForCondition();
              return chunks.some((chunk) => chunk.name !== 'vendors' && /[\\/]node_modules[\\/]/.test(name));
            },
          },
        },
      },
    },
  }),
};
module.exports = config;
