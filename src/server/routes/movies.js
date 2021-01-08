import express from 'express';

const moviesRouter = (app) => {
  const router = express.Router();

  app.use('/movies', router);

  router.get('/', (req, res, next) => {

  });
};

export default moviesRouter;
