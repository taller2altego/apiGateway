const { default: axios } = require("axios");
const logger = require("../../winston");
const { post, get, patch, remove } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');

class UserController {

  signUp(req, res, next) {
    return post("http://user_microservice:5000/users", req.body)
      .then(axiosResponse => handlerResponse(axiosResponse, {}))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findAllUsers(req, res, next) {
    return get("http://user_microservice:5000/users")
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findUserById(req, res, next) {
    return get(`http://user_microservice:5000/users/${req.params.id}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchUserById(req, res, next) {
    return patch(`http://user_microservice:5000/users/${req.params.id}`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  removeUserById(req, res, next) {
    return remove(`http://user_microservice:5000/users/${req.params.id}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  associateDriverToUser(req, res, next) {
    return post(`http://user_microservice:5000/users/${req.params.id}/driver`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }


}

module.exports = new UserController();