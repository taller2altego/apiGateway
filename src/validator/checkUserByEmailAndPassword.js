const { constants: { OAuthMethod }, endpoints: { userMicroservice } } = require('config');

const handlerResponse = require("../utils/handlerResponse");
const { get, post } = require("../utils/axios");
const logger = require('../../winston');

const oauthCheck = async (req, res, next) => {
  const url = process.env.user_microservice || userMicroservice;
  const email = req.customBody.oauthData.email;

  return get(`${url}/users/login/oauth?email=${email}`)
    .then(({ data: { data } }) => {
      req.body = req.customBody.oauthData;
      req.customBody = { id: data.id, isAdmin: data.isAdmin, isSuperadmin: data.isSuperadmin };
      next();
    })
    .catch(err => {
      const { statusCode, ...otherFields } = handlerResponse(err);
      const log = { ...otherFields, statusCode };

      if (statusCode === 404) {
        return post(`${url}/users/oauth`, req.customBody.oauthData)
          .then(({ data }) => {
            req.body = { ...req.customBody.oauthData };
            req.customBody = { id: data.id, isAdmin: false, isSuperadmin: false };
            next();
          })
          .catch(error => {
            const { statusCode, ...otherFields } = handlerResponse(error);
            const log = { ...otherFields, statusCode };
            logger.error(JSON.stringify(log));
            res.status(statusCode).send(otherFields);
          });
      } else {
        logger.error(JSON.stringify(log));
        res.status(statusCode).send(otherFields);
      }
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

module.exports = methodAuthentication => {
  return methodAuthentication === OAuthMethod ? oauthCheck : commonCheck;
}