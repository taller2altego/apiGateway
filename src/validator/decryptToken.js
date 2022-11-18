const logger = require('../../winston');
const CLIENT_ID = '1048799441742-pfgd2bp87dl12uj40ug0c1q5ltc38ser.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

module.exports = (req, res, next) => {

  if (req.headers.authorization === undefined) {
    res.status(401).send({ message: 'Access token es requerido' });
    return;
  }

  const authorization = req.headers.authorization.split(' ');
  const token = authorization[0] === 'Bearer' ? authorization[1] : '';

  return client
    .verifyIdToken({ idToken: token, audience: CLIENT_ID })
    .then(res => {
      const { email_verified, ...payload } = res.getPayload();
      
      if (email_verified) {
        const customBody = req.customBody || {};
        const oauthData = { email: payload.email, name: payload.given_name, lastname: payload.family_name, phoneNumber: 1, role: "user" };
        req.customBody = { customBody, oauthData };
        next();
      } else {
        res.status(404).send({ message: 'El token no es válido' });
        return;
      }
    })
    .catch(err => {
      logger.error(JSON.stringify(err, undefined, 2));
      res.status(404).send({ message: 'El token no es válido' });
      return;
    });
};