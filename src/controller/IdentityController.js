const { post } = require('../utils/axios');
const handlerError = require('../utils/handlerError');

class UserController {
  async signIn(req, res, next) {
    return post("http://login_microservice:5000/login", req.body)
      .then(response => {
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        res.customResponse = handlerError(err);
        next();
      });
  }

  async signOut(req, res, next) {
    return post("http://login_microservice:5000/logout", req.headers)
      .then(response => {
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        res.customResponse = handlerError(err);
        next();
      });
  }
}

module.exports = new UserController();