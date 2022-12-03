const { endpoints } = require('config');

const { post } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');
const metricProducer = require('../utils/metricProducer');

class IdentityController {
  signIn(req, res, next) {
    const url = process.env.identity_microservice || endpoints.identityMicroservice;

    const { id } = req.customBody;
    const { isAdmin } = req.customBody;
    const { isSuperadmin } = req.customBody;

    return post(`${url}/login`, {
      ...req.body, isAdmin, id, isSuperadmin
    })
      .then(axiosResponse => handlerResponse(axiosResponse, { id }))
      .catch(error => handlerResponse(error))
      .then(response => {
        metricProducer(JSON.stringify({ metricName: 'loginUsers.emailAndPassword' }));
        res.customResponse = response;
        next();
      });
  }

  signOut(req, res, next) {
    const url = process.env.identity_microservice || endpoints.identityMicroservice;
    return post(`${url}/logout`, {}, { authorization: req.headers.authorization })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  async sendEmail(req, res, next) {
    const url = process.env.identity_microservice || endpoints.identityMicroservice;
    return post(`${url}/login/send_token`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        metricProducer(JSON.stringify({ metricName: 'recoverPassword' }));
        res.customResponse = response;
        next();
      });
  }
}

module.exports = new IdentityController();
