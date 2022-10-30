const jwt = require('jsonwebtoken');
const { endpoints } = require('config');

const { post, get, patch, remove } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');
const logger = require('../../winston');

class UserController {

  signUp(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return post(`${url}/users`, req.body, {}, { ...req.query })
      .then(axiosResponse => handlerResponse(axiosResponse, {}))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findAllUsers(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return get(`${url}/users`, { ...req.query })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findUserById(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return get(`${url}/users/${req.params.id}`, { ...req.query })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchUserById(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return patch(`${url}/users/${req.params.id}`, req.body, {}, { ...req.query })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  removeUserById(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return remove(`${url}/users/${req.params.id}`, { ...req.query })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  associateDriverToUser(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return post(`${url}/users/${req.params.id}/driver`, req.body)
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
    };

    const url = process.env.user_microservice || endpoints.userMicroservice;
    return post(`${url}/users/changePassword`, body)
      .then(() => {
        res.customResponse = { statusCode: 204 };
        next();
      })
      .catch((err) => {
        logger.error(JSON.stringify(err, undefined, 2));
        next();
      });
  }
}

module.exports = new UserController();