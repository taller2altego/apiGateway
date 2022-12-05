const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '1048799441742-pfgd2bp87dl12uj40ug0c1q5ltc38ser.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const logger = require('../../winston');

module.exports = (req, res, next) => {
  if (req.headers.authorization === undefined) {
    return res.status(401).send({ message: 'Access token es requerido' });
  }

  const authorization = req.headers.authorization.split(' ');
  const token = authorization[0] === 'Bearer' ? authorization[1] : '';

  return client
    .verifyIdToken({ idToken: token, audience: CLIENT_ID })
    .then(response => {
      /* eslint-disable camelcase */
      const { email_verified, ...payload } = response.getPayload();

      /* eslint-disable camelcase */
      if (email_verified) {
        const customBody = req.customBody || {};
        const oauthData = {
          email: payload.email, name: payload.given_name, lastname: payload.family_name, phoneNumber: 1, role: 'user'
        };
        req.customBody = { customBody, oauthData };
        return next();
      }
      return res.status(404).send({ message: 'El token no es válido' });
    })
    .catch(err => {
      logger.error(JSON.stringify(err, undefined, 2));
      return res.status(404).send({ message: 'El token no es válido' });
    });
};
