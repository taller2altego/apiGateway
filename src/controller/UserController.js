const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
const { endpoints: { userMicroservice } } = require('config');

const logger = require(`../../winston`);
const { post, get, patch, remove } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');

class UserController {

  signUp(req, res, next) {
    return post(`${userMicroservice}/users`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse, {}))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findAllUsers(req, res, next) {
    return get(`${userMicroservice}/users`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findUserById(req, res, next) {
    return get(`${userMicroservice}/users/${req.params.id}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchUserById(req, res, next) {
    return patch(`${userMicroservice}/users/${req.params.id}`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  removeUserById(req, res, next) {
    return remove(`${userMicroservice}/users/${req.params.id}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  associateDriverToUser(req, res, next) {
    return post(`${userMicroservice}/users/${req.params.id}/driver`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  changePassword(req, res, next) {
    const authorization = req.headers.authorization && req.headers.authorization.split(' ');
    const token = authorization[0] === 'Bearer' ? authorization[1] : '';
    const { payload } = jwt.decode(token, { complete: true });
    const body = {
      email: payload.email,
      newPassword: req.body.newPassword
    }
    return post(`${userMicroservice}/users/changePassword`, body)
      .then(() => {
        res.customResponse = { statusCode: 204 };
        next();
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  }
}

module.exports = new UserController();