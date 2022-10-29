const { post } = require("../utils/axios");

module.exports = (req, res, next) => {
  return post(`${userMicroservice}users/verifyUserByEmail`, req.body)
    .then(() => {
      next()
    })
    .catch(() => {
      res.status(404).send({ message: 'User Not Found' })
    });
};