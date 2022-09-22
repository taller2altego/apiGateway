const { post } = require('../utils/axios');
const handlerError = require('../utils/handlerError');

class UserController {
  async signIn(req, res, next) {
    const userResponse = await get(`http://user_microservice:5000/users?email=${req.body.email}`)
      .then(({ data }) => data.data);

    // TODO: agregar error al handler
    if (!userResponse.length) {
      res.customResponse = { statusCode: 404, message: 'El usuario no fue identificado' };
      next();
    }

    const id = userResponse[0].id;
    return post("http://login_microservice:5000/login", req.body)
      .then(loginResponse => {
        const token = loginResponse.data.token;
        res.customResponse = { statusCode: 200, ...{ id, token } };
        next();
      })
      .catch(err => {
        console.log(err);
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