const { constants: { OAuthMethod }, endpoints: { userMicroservice } } = require('config');
const Metrics = require('hot-shots');

const statsD = new Metrics();

const handlerResponse = require('../utils/handlerResponse');
const { get, post } = require('../utils/axios');
const logger = require('../../winston');

const oauthCheck = async (req, res, next) => {
  const url = process.env.user_microservice || userMicroservice;
  const { email } = req.customBody.oauthData;

  const handlerOauthCatch = error => {
    const { statusCode, ...otherFields } = handlerResponse(error);
    const log = { ...otherFields, statusCode };
    logger.error(JSON.stringify(log));
    res.status(statusCode).send(otherFields);
  };

  return get(`${url}/users/login/oauth?email=${email}`)
    .then(({ data: { data } }) => {
      statsD.increment('loginUsers.oauth');
      req.body = req.customBody.oauthData;
      req.customBody = { id: data.id, isAdmin: data.isAdmin, isSuperadmin: data.isSuperadmin };
      next();
    })
    .catch(err => {
      const { statusCode, ...otherFields } = handlerResponse(err);
      const log = { ...otherFields, statusCode };

      if (statusCode === 404) {
        return post(`${url}/users/oauth`, req.customBody.oauthData).then().catch(handlerOauthCatch);
      }
      logger.error(JSON.stringify(log));
      return res.status(statusCode).send(otherFields);
    });
};

const commonCheck = (req, res, next) => {
  const url = process.env.user_microservice || userMicroservice;
  return get(`${url}/users/login?email=${req.body.email}&password=${req.body.password}`)
    .then(({ data: { data } }) => {
      if (!data) {
        res.status(404).send({ message: 'El usuario no fue identificado' });
        return;
      }
      req.customBody = { id: data.id, isAdmin: data.isAdmin, isSuperadmin: data.isSuperadmin };
      next();
    })
    .catch(err => {
      const { statusCode, ...otherFields } = handlerResponse(err);
      const log = { ...otherFields, statusCode };
      logger.error(JSON.stringify(log));
      res.status(statusCode).send(otherFields);
    });
};

module.exports = methodAuthentication => (
  methodAuthentication === OAuthMethod ? oauthCheck : commonCheck
);
