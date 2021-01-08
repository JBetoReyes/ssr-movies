import express from 'express';
import passport from 'passport';
import boom from '@hapi/boom';
import axios from 'axios';

require('../utils/auth/strategies/basic');

const {
  ENV: env,
  API_URL: apiUrl,
} = process.env;

const authRouter = (app) => {
  const router = express.Router();
  app.use('/auth', router);
  router.post('/sign-in', async (req, res, next) => {
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
          req.cookie('token', token, {
            httpOnly: env === 'production',
            secure: env === 'production',
          });
          res.status(200).json(user);
        });
      } catch (err) {
        next(err);
      }
    })(req, res, next);
  });

  router.post('/sign-up', async (req, res, next) => {
    const { data: { user } } = req.body;
    console.log('api url: ', apiUrl);
    try {
      const { data, status } = await axios({
        url: `${apiUrl}/auth/sign-up`,
        method: 'post',
        data: {
          data: {
            user,
          },
        },
      });
      console.log('data: ', data);
      res.status(status).json({ data: { message: 'user created' } });
    } catch (err) {
      let errToThrow = err;
      if (err.response && err.response.data) {
        errToThrow = err.response.data;
      }
      next(errToThrow);
    }
  });
};

export default authRouter;
