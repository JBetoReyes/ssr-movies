import express from 'express';
import axios from 'axios';

const {
  API_URL: apiUrl,
} = process.env;

const userMoviesRouter = (app) => {
  const router = express.Router();
  app.use('/user-movies', router);
  router.post('/', async (req, res, next) => {
    const { data } = req.body;
    const { token } = req.cookies;
    try {
      const { data, status } = axios({
        url: `${apiUrl}/user-movies`,
        method: 'POST',
        data: {
          data,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res.statue(201).json(data);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:userMovieId', async (req, res, next) => {

  });
};

export default userMoviesRouter;
