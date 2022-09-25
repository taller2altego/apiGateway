module.exports = (req, res, next) => {
  return post("http://login_microservice:5000/token", {}, { authorization: req.headers.authorization })
    .then(() => {
      next()
    })
    .catch(() => {
      res.status(401).send({ message: 'Unauthorized' })
    });
};