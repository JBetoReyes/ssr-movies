/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
/* eslint-disable no-tabs */
import express from 'express';
import chalk from 'chalk';
import webpack from 'webpack';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import Layout from '../frontend/components/Layout';
import routes from '../frontend/routes/serverRoutes';
import reducer from '../frontend/reducers';
import getManifest from './getManifest';
import routerProvider from './routes';

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
} else {
  app.use((req, res, next) => {
    req.hashManifest = getManifest();
    next();
  });
  app.use(express.static(`${__dirname}/public`));
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
}

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
routerProvider(app);

const setResponse = (html, preloadedState, manifest) => {
  const mainStyles = manifest ? manifest['main.css'] : 'assets/app.css';
  const mainJs = manifest ? manifest['main.js'] : 'assets/app.js';
  const vendor = manifest && manifest['vendors.js'];
  return `
  <!DOCTYPE html>
		<html>
			<head>
				<link rel="stylesheet" href="${mainStyles}"/>
        ${manifest ? `<script src="${vendor}" type="text/javascript" defer></script>` : ''}
				<script src="${mainJs}" type="text/javascript" defer></script>
				<title>videos</title>
			</head>
			<body>
				<div id="app">${html}</div>
				<script>
					// WARNING: See the following for security issues around embedding JSON in HTML:
					// https://redux.js.org/recipes/server-rendering/#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
				</script>
			</body>
		</html>
	`;
};

const createInitialState = ({ id, name, email }) => {
  const initialState = {
    user: {},
    playing: {},
    myList: [],
    trends: [],
    originals: [],
  };
  if (id) {
    initialState.user.email = email;
    initialState.user.name = name;
    initialState.user.id = id;
  }
  return initialState;
};

const renderApp = async (req, res) => {
  const { id, name, email } = req.cookies;
  const initialState = createInitialState({ id, name, email });
  const isLogged = (id);
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const html = renderToString(
    <Provider store={store}>
      <Layout>
        <StaticRouter location={req.url} context={{}}>
          {renderRoutes(routes(isLogged))}
        </StaticRouter>
      </Layout>
    </Provider>,
  );
  res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.get('*', renderApp);

app.listen(port, () => {
  console.log(`Server listening on port: ${chalk.green(port)}`);
});
