const { endpoints } = require('config');
const logger = require('../../winston');
const { post } = require("../utils/axios");
const handlerResponse = require('../utils/handlerResponse');

module.exports = (req, res, next) => {
  const url = process.env.identity_microservice || endpoints.identityService;

  return post(`${url}/token`, {}, { authorization: req.headers.authorization })
    .then(() => {
      next()
    })
    .catch(err => {
      const { statusCode, ...other } = handlerResponse(err);
      logger.error(JSON.stringify({ ...other, statusCode }));
      res.status(statusCode).send({ message: other });
    });
};