const { endpoints } = require('config');
const logger = require('../../winston');
const { post } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');

module.exports = (req, res, next) => {
  const url = process.env.identity_microservice || endpoints.identityMicroservice;

  if (req.headers.authorization === undefined) {
    res.status(401).send({ message: 'Access token es requerido' });
  }

  return post(`${url}/token`, {}, { authorization: req.headers.authorization })
    .then(({ data }) => {
      const { isAdmin, isSuperadmin, id } = data;
      req.query.isSuperadmin = isSuperadmin;
      req.query.isAdmin = isAdmin;
      req.query.id = id;
      next();
    })
    .catch(err => {
      const { statusCode, ...other } = handlerResponse(err);
      logger.error(JSON.stringify({ ...other, statusCode }, undefined, 2));
      res.status(statusCode).send({ ...other });
    });
};
