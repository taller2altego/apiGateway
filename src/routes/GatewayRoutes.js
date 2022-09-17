module.exports = app => {
  const user = require('../controller/UserController');
  const identity = require('../controller/IdentityController');
  const { post } = require('../utils/axios');
  const router = require('express').Router();

  const handlerResponse = (req, res) => {
    const { statusCode, ...otherFields } = res.customResponse;
    res.status(statusCode).send(otherFields);
  };

  const validateToken = (req, res, next) => {
    console.log('hasta aca llega');
    console.log(JSON.stringify(req.headers, undefined, 2));
    return post("http://login_microservice:5000/token", {}, { authorization: req.headers.authorization })
      .then(() => next())
      .catch(() => res.status(401).send({ message: 'Unauthorized' }));
  };

  // user-microservice 
  app.use('/', router);
  router.post('/users', user.signUp, handlerResponse);
  router.get('/users/', validateToken, user.findAllUsers, handlerResponse);
  router.get('/users/:id', validateToken, user.findUserById, handlerResponse);
  router.patch('/users/:id', validateToken, user.patchUserById, handlerResponse);
  router.delete('/users/:id', validateToken, user.removeUserById, handlerResponse);
  router.post('/users/:id/driver', validateToken, user.associateDriverToUser, handlerResponse);
  // router.post('/users/reset_password', validateToken, user.changePasswordByUsername, handlerResponse);

  // credential-microservice
  router.post('/login', identity.signIn, handlerResponse);
  router.post('/logout', validateToken, identity.signOut, handlerResponse);
};