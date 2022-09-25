module.exports = (req, res, next) => {
  return post("http://user_microservice:5000/users/verifyUserByEmail", req.body)
    .then(() => {
      next()
    })
    .catch(() => {
      res.status(404).send({ message: 'User Not Found' })
    });
};