const passport = require('passport');
const axios = require('axios');
const boom = require('@hapi/boom');
const { OAuth2Strategy } = require('passport-oauth');

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';
const {
  GOOGLE_CLIENT_ID: googleClientId,
  GOOGLE_CLIENT_SECRET: googleClientSecret,
  API_URL: apiUrl,
  PUBLIC_API_KEY_TOKEN: apiKeyToken,
} = process.env;
const oAuth2Strategy = new OAuth2Strategy(
  {
    authorizationURL: GOOGLE_AUTHORIZATION_URL,
    tokenURL: GOOGLE_TOKEN_URL,
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: '/auth/google-oauth/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    const { data, status } = await axios({
      url: `${apiUrl}/auth/sign-provider`,
      method: 'POST',
      data: {
        data: {
          name: profile.name,
          email: profile.email,
          password: profile.id,
          apiKeyToken,
        },
      },
    });
    if (!data || status !== 200) {
      done(boom.unauthorized());
      return;
    }
    done(null, data);
  }
);

oAuth2Strategy.userProfile = function getUserProfile(accessToken, done) {
  this._oauth2.get(GOOGLE_USERINFO_URL, accessToken, (err, body) => {
    if (err) {
      done(err);
      return;
    }
    try {
      const { sub, name, email } = JSON.parse(body);
      const profile = {
        id: sub,
        name,
        email,
      };
      done(null, profile);
    } catch (error) {
      done(error);
    }
  });
};

passport.use('google-oauth', oAuth2Strategy);
