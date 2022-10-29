const handlerResponse = require("../utils/handlerResponse");
const { endpoints: { userMicroservice } } = require('config');
const { get } = require("../utils/axios");

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
      console.log(err);
      const { statusCode, ...otherFields } = handlerResponse(err);
      res.status(statusCode).send(otherFields);
    });
}