const { endpoints: { userMicroservice } } = require('config');

const handlerResponse = require("../utils/handlerResponse");
const { get } = require("../utils/axios");
const logger = require('../../winston');

module.exports = (req, res, next) => {
  return get(`${userMicroservice}/users/login?email=${req.body.email}&password=${req.body.password}`)
    .then(({ data: { data } }) => {
      if (!data.length) {
        res.status(404).send({ message: 'El usuario no fue identificado' });
        return;
      }
      req.customBody = { id: data[0].id };
      next();
    })
    .catch(err => {
      logger.error(err);
      const { statusCode, ...otherFields } = handlerResponse(err);
      res.status(statusCode).send(otherFields);
    });
}