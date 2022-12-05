const { endpoints: { userMicroservice } } = require('config');
const { post } = require('../utils/axios');

module.exports = (req, res, next) => {
  const url = process.env.user_microservice || userMicroservice;
  return post(`${url}/users/verifyUserByEmail`, req.body)
    .then(() => next())
    .catch(() => {
      res.status(404).send({ message: 'User Not Found' });
    });
};
