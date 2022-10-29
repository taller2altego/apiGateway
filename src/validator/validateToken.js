const { post } = require("../utils/axios");

module.exports = (req, res, next) => {
  return post(`${userMicroservice}/token`, {}, { authorization: req.headers.authorization })
    .then(() => {
      next()
    })
    .catch(() => {
      res.status(401).send({ message: 'Unauthorized' })
    });
};