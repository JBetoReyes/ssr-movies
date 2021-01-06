/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable no-tabs */
import express from 'express';
import chalk from 'chalk';
import webpack from 'webpack';
import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore, compose } from 'redux';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers';
import initialState from '../frontend/initialState';

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

const setResponse = (html) => (`
  <!DOCTYPE html>
		<html>
			<head>
				<link rel="stylesheet" href="assets/app.css"/>
				<script src="assets/app.js" type="text/javascript" defer></script>
				<title>videos</title>
			</head>
			<body>
				<div id="app">${html}</div>
			</body>
		</html>
	`);

const renderApp = (req, res) => {
  const store = createStore(reducer, initialState);
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>,
  );
  res.send(setResponse(html));
};

app.get('*', renderApp);

app.listen(port, () => {
  console.log(`Server listening on port: ${chalk.green(port)}`);
});
