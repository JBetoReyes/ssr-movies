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
      const { data: axiosData, status } = await axios({
        url: `${apiUrl}/user-movies`,
        method: 'POST',
        data: {
          data,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res.status(201).json(axiosData);
    } catch (err) {
      let errorToThrow = err;
      if (err.response && err.response.data) {
        errorToThrow = err.response.data;
      }
      next(errorToThrow);
    }
  });

  router.delete('/:userMovieId', async (req, res, next) => {
    const { userMovieId } = req.params;
    const { token } = req.cookies;
    try {
      const { data: axiosData, status } = await axios({
        url: `${apiUrl}/user-movies/${userMovieId}`,
        method: 'DELETE',
        data: {
          data: {
            userMovie: userMovieId,
          },
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res.status(201).json(axiosData);
    } catch (err) {
      let errorToThrow = err;
      if (err.response && err.response.data) {
        errorToThrow = err.response.data;
      }
      next(errorToThrow);
    }
  });
};

export default userMoviesRouter;
