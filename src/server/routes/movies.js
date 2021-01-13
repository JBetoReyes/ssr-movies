import express from 'express';
import axios from 'axios';

const {
  API_URL: apiUrl,
} = process.env;

const moviesRouter = (app) => {
  const router = express.Router();

  app.use('/movies', router);

  router.get('/', async (req, res, next) => {
    try {
      const { token } = req.cookies;
      const { data, status } = await axios({
        url: `${apiUrl}/movies`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      res.status(200).json({
        data: data.data,
      });
    } catch (err) {
      let errorToThrow = err;
      if (err.response && err.response.data) {
        errorToThrow = err.response.data;
      }
      next(errorToThrow);
    }
  });
};

export default moviesRouter;
