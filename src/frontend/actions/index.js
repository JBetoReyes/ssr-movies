import axios from 'axios';

export const setFavorite = (payload) => ({
  type: 'SET_FAVORITE',
  payload,
});

export const deleteFavorite = (payload) => ({
  type: 'DELETE_FAVORITE',
  payload,
});

export const loginRequest = (payload) => ({
  type: 'LOGIN_REQUEST',
  payload,
});

export const logoutRequest = (payload) => ({
  type: 'LOGOUT_REQUEST',
  payload,
});

export const registerRequest = (payload) => ({
  type: 'REGISTER_REQUEST',
  payload,
});

export const getVideoSource = (payload) => ({
  type: 'GET_VIDEO_SOURCE',
  payload,
});

export const setError = (payload) => ({
  type: 'SET_ERROR',
  payload,
});

export const registerUser = (payload, redirectUrl) => async (dispatch) => {
  axios.post('/auth/sign-up', {
    data: {
      user: payload,
    },
  }).then(({ data }) => {
    dispatch(registerRequest(data));
  }).then(() => {
    window.location.href = redirectUrl;
  }).catch((err) => {
    console.log('err', err);
    // dispatch(setError(err));
  });
};

export const loginUser = ({ email, password }, redirectUrl) => async (dispatch) => {
  axios({
    url: '/auth/sign-in',
    method: 'POST',
    data: {
      data: {
        email,
        password,
      },
    },
    auth: {
      username: email,
      password,
    },
  }).then(({ data }) => {
    const { email: userEmail, name, id } = data;
    document.cookie = `email=${userEmail}`;
    document.cookie = `name=${name}`;
    document.cookie = `id=${id}`;
    dispatch(loginRequest(data));
  }).then(() => {
    window.location.href = redirectUrl;
  }).catch((err) => {
    console.log(err);
  });
};

export const addMovieToMyList = (movie) => async (dispatch) => {
  try {
    const { _id: movieId } = movie;
    const { data } = await axios({
      url: '/user-movies',
      method: 'POST',
      data: {
        data: {
          movieId,
        },
      },
    });
    console.log('movies list data: ', data);
    dispatch(setFavorite(movie));
  } catch (err) {
    console.log(err);
  }
};

export const deleteFromMovieList = (movieId) => async (dispatch) => {
  try {
    const { data } = await axios({
      url: `/user-movies/${movieId}`,
      method: 'delete',
    });
    console.log('Movie to delete: ', movieId);
    dispatch(deleteFavorite(movieId));
  } catch (err) {
    console.log(userMoviesRouter);
  }
};
