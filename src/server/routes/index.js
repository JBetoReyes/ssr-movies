import authRouter from './auth';
import moviesRouter from './movies';
import userMoviesRouter from './userMovies';

const routers = [
  authRouter,
  moviesRouter,
  userMoviesRouter,
];

const routersProvider = (app) => {
  routers.forEach((router) => {
    router(app);
  });
};

export default routersProvider;
