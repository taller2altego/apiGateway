const jwt = require('jsonwebtoken');
const { endpoints } = require('config');

const { post, get, patch, remove } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');
const logger = require('../../winston');

const Metrics = require('hot-shots');
const statsD = new Metrics();

class UserController {
  signUp(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return post(`${url}/users`, req.body, {}, { ...req.query })
      .then(axiosResponse => handlerResponse(axiosResponse, {}))
      .catch(error => handlerResponse(error))
      .then(response => {
        statsD.increment('createdUsers.emailAndPassword');
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

  _patchUserById(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;

    return patch(`${url}/users/${req.params.id}`, req.body, {}, { ...req.query })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  async patchUserById(req, res, next) {
    try {
      if (req.body.isBlocked === true) {
        const identityUrl = process.env.identity_microservice || endpoints.identityMicroservice;
        await post(`${identityUrl}/logout`, {}, { authorization: req.headers.authorization });
        return this
          ._patchUserById(req, res, next)
          .then(res => {
            statsD.increment('blockedUsers');
            return res;
          });
      } else {
        return this._patchUserById(req, res, next);
      }


    } catch (error) {
      logger.error(JSON.stringify(error, undefined, 2));
      res.customResponse = handlerResponse(error);
      next();
    }
  }

  patchUserByEmail(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return patch(`${url}/users`, req.body, {}, { ...req.query })
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
}

module.exports = new UserController();