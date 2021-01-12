const passport = require('passport');
const axios = require('axios');
const boom = require('@hapi/boom');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');

const {
  GOOGLE_CLIENT_ID: googleClientId,
  GOOGLE_CLIENT_SECRET: googleClientSecret,
  PUBLIC_API_KEY_TOKEN: publicApiKeyToken,
  API_URL: apiUrl,
} = process.env;

passport.use(new GoogleStrategy({
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: '/auth/google/callback',
}, async (acessToken, refreshToken, profile, done) => {
  const { displayName: name } = profile;
  const { data, status } = await axios({
    url: `${apiUrl}/auth/sign-provider`,
    method: 'POST',
    data: {
      data: {
        name,
        email: profile._json.email,
        password: profile.id,
        apiKeyToken: publicApiKeyToken,
      },
    },
  });
  if (!data || status !== 200) {
    done(boom.unauthorized(), false);
    return;
  }
  done(null, data);
}));
