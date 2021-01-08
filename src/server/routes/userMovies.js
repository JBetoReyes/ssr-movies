import express from 'express';

const userMoviesRouter = (app) => {
  const router = express.Router();
  app.use('/user-movies', router);
  router.post('/', async (req, res, next) => {

  });
  router.delete('/:userMovieId', async (req, res, next) => {

  });
};

export default userMoviesRouter;
