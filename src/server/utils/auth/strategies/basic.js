const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const axios = require('axios');
const boom = require('@hapi/boom');

const { PUBLIC_API_KEY_TOKEN: publicApiKeyToken, API_URL: apiUrl } = process.env;

passport.use(new BasicStrategy(async (email, password, done) => {
  try {
    const { data, status } = await axios({
      url: `${apiUrl}/auth/sign-in`,
      method: 'post',
      auth: {
        password,
        username: email,
      },
      data: {
        apiKeyToken: publicApiKeyToken,
      },
      responseType: 'application/json',
      validateStatus: false,
    });
    if (!data || status !== 200) {
      done(boom.unauthorized(), false);
      return;
    }
    done(null, data);
  } catch (err) {
    console.log(err.toJSON());
    done(err);
  }
}));
