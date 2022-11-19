const { endpoints } = require('config');

const { post } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');

const Metrics = require('hot-shots');
const statsD = new Metrics();

class IdentityController {

  signIn(req, res, next) {
    const url = process.env.identity_microservice || endpoints.identityMicroservice;

    const id = req.customBody.id;
    const isAdmin = req.customBody.isAdmin;
    const isSuperadmin = req.customBody.isSuperadmin;

    return post(`${url}/login`, { ...req.body, isAdmin, id, isSuperadmin })
      .then(axiosResponse => handlerResponse(axiosResponse, { id }))
      .catch(error => handlerResponse(error))
      .then(response => {
        statsD.increment('loginUsers.emailAndPassword');
        res.customResponse = response;
        next();
      });
  }

  signOut(req, res, next) {
    const url = process.env.user_microservice || endpoints.identityMicroservice;
    return post(`${url}/logout`, {}, { authorization: req.headers.authorization })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  async sendEmail(req, res, next) {
    const url = process.env.user_microservice || endpoints.identityMicroservice;
    return post(`${url}/login/send_token`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        statsD.increment('recoverPassword');

        res.customResponse = response;
        next();
      });
  }
}

module.exports = new IdentityController();