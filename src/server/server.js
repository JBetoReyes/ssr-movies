/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable no-tabs */
import express from 'express';
import chalk from 'chalk';
import webpack from 'webpack';

const { ENV: env, PORT: port } = process.env;

const app = express();
if (env === 'development') {
  const webpackConfig = require('../../webpack.dev.config.js');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const webpackServerConfig = {
    port,
    hot: true,
  };

  app.use(webpackDevMiddleware(compiler, webpackServerConfig));
  app.use(webpackHotMiddleware(compiler));
}
app.get('*', (req, res) => {
  res.send(`<!DOCTYPE html>
		<html>
			<head>
				<link rel="stylesheet" href="assets/app.css"/>
				<script src="assets/app.js" type="text/javascript" defer></script>
				<title>videos</title>
			</head>
			<body>
				<div id="app"></div>
			</body>
		</html>
	`);
});

app.listen(port, () => {
  console.log(`Server listening on port: ${chalk.green(port)}`);
});
