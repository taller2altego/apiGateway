const { post, get } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');

class IdentityController {
  signIn(req, res, next) {
    const id = req.customBody.id;
    return post("http://login_microservice:5000/login", req.body)
      .then(axiosResponse => handlerResponse(axiosResponse, { id }))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  signOut(req, res, next) {
    return post("http://login_microservice:5000/logout", {}, { authorization: req.headers.authorization })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  async sendEmail(req, res, next) {
    console.log(req.body)
    return post("http://login_microservice:5000/login/send_token", req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }
}

module.exports = new IdentityController();