import express from 'express';
import passport from 'passport';
import boom from '@hapi/boom';
import axios from 'axios';

require('../utils/auth/strategies/basic');
require('../utils/auth/strategies/oauth.js');
require('../utils/auth/strategies/google.js');

const { ENV: env, API_URL: apiUrl } = process.env;

const ONE_HOUR = 60 * 60;
const THIRTY_DAYS_IN_SEC = 30 * 24 * ONE_HOUR;
const TWO_HOUR_IN_SEC = 2 * ONE_HOUR;

const authRouter = (app) => {
  const router = express.Router();
  app.use('/auth', router);
  router.post('/sign-in', async (req, res, next) => {
    const {
      data: { rememberMe },
    } = req.body;
    passport.authenticate('basic', (error, data) => {
      if (error || !data) {
        next(boom.unauthorized());
        return;
      }
      const { token, user } = data;
      try {
        req.login(user, { session: false }, async (err) => {
          if (err) {
            next(err);
            return;
          }
          res.cookie('token', token, {
            httpOnly: env === 'production',
            secure: env === 'production',
            maxAge: rememberMe ? THIRTY_DAYS_IN_SEC : TWO_HOUR_IN_SEC,
          });
          res.status(200).json(user);
        });
      } catch (err) {
        next(err);
      }
    })(req, res, next);
  });

  router.post('/sign-up', async (req, res, next) => {
    try {
      const {
        data: { user },
      } = req.body;
      const { data: axiosData, status } = await axios({
        url: `${apiUrl}/auth/sign-up`,
        method: 'post',
        data: {
          data: {
            user,
          },
        },
      });
      res.status(status).json({ name: user.name, email: user.email });
    } catch (err) {
      let errToThrow = err;
      if (err.response && err.response.data) {
        errToThrow = err.response.data;
      }
      next(errToThrow);
    }
  });
  router.get(
    '/google-oauth',
    passport.authenticate('google-oauth', {
      scope: ['email', 'profile', 'openid'],
    }),
  );
  router.get(
    '/google-oauth/callback',
    passport.authenticate('google-oauth', { session: false }),
    (req, res, next) => {
      if (!req.user) {
        next(boom.authenticate());
        return;
      }
      const { token, ...user } = req.user;
      res.cookie('token', token, {
        httpOnly: env === 'production',
        secure: env === 'production',
      });
      const { sub, name, email } = user;
      res.status(200).json({
        sub,
        name,
        email,
      });
    },
  );

  router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['email', 'profile', 'openid'],
    }),
  );
  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res, next) => {
      if (!req.user) {
        next(boom.authenticate());
        return;
      }
      const { token, ...user } = req.user;
      res.cookie('token', token, {
        httpOnly: env === 'production',
        secure: env === 'production',
      });
      res.status(200).json({
        id: user.sub,
        name: user.name,
        email: user.email,
      });
    },
  );
};

export default authRouter;
