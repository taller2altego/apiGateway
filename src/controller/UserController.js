const { default: axios } = require("axios");
const logger = require("../../winston");
const { post, get, patch, remove } = require('../utils/axios');
const handlerError = require('../utils/handlerError');


class UserController {
  async signUp(req, res, next) {
    return post("http://user_microservice:5000/users", req.body)
      .then(response => {
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        res.customResponse = handlerError(err);
        next();
      });
  }

  async findAllUsers(req, res, next) {
    return get("http://user_microservice:5000/users")
      .then(response => {
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        res.customResponse = handlerError(err);
        next();
      });
  }

  async findUserById(req, res, next) {
    return get("http://user_microservice:5000/users/" + req.params.id)
      .then(response => {
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        res.customResponse = handlerError(err);
        next();
      });
  }

  async patchUserById(req, res, next) {
    console.log(req.params.id);
    console.log(req.body);
    return patch("http://user_microservice:5000/users/" + req.params.id, req.body, req.headers)
      .then(response => {
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        res.customResponse = handlerError(err);
        next();
      });
  }

  async removeUserById(req, res, next) {
    return remove("http://user_microservice:5000/users/" + req.params.id)
      .then(response => {
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        res.customResponse = handlerError(err);
        next();
      });
  }

  async changePasswordByUsername(req, res, next) {
    return post("http://user_microservice:5000/reset_password", req.body)
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