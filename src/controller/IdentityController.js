const { post, get } = require('../utils/axios');
const handlerError = require('../utils/handlerError');

class UserController {
  async signIn(req, res, next) {
    return Promise.all([
      get(`http://user_microservice:5000/users?email=${req.body.email}`),
      post("http://login_microservice:5000/login", req.body)
    ])
      .then(([usersResponse, loginResponse]) => {
        const id = usersResponse.data.data[0].id;
        const token = loginResponse.data.token;
        res.customResponse = { statusCode: 200, ...{ id, token } };
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