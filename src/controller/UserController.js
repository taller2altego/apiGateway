const { default: axios } = require("axios");
const logger = require("../../winston");
const { post, get, patch, remove } = require('../utils/axios');
const handlerError = require('../utils/handlerError');


class UserController {
  async signUp(req, res, next) {
    const response = await post("http://user_microservice:5000/users", req.body)
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));
    res.customResponse = response;
    next();
  }

  async findAllUsers(req, res, next) {
    const response = await get("http://user_microservice:5000/users")
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));
    res.customResponse = response;
    next();
  }

  async findUserById(req, res, next) {
    const response = await get(`http://user_microservice:5000/users/${req.params.id}`)
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));
    res.customResponse = response;
    next();
  }

  async patchUserById(req, res, next) {
    const response = await patch(`http://user_microservice:5000/users/${req.params.id}`, req.body)
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));
    res.customResponse = response;
    next();
  }

  async removeUserById(req, res, next) {
    const response = await remove(`http://user_microservice:5000/users/${req.params.id}`)
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));
    res.customResponse = response;
    next();
  }

  async associateDriverToUser(req, res, next) {
    console.log(req.params);
    const response = await post(`http://user_microservice:5000/users/${req.params.id}/driver`, req.body)
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));

    res.customResponse = response;
    next();
  }

  // async changePasswordByUsername(req, res, next) {
  //   return post("http://user_microservice:5000/reset_password", req.body)
  //     .then(response => {
  //       res.customResponse = { statusCode: 200, ...response.data };
  //       next();
  //     })
  //     .catch(err => {
  //       res.customResponse = handlerError(err);
  //       next();
  //     });
  // }
}

module.exports = new UserController();