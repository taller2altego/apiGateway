const checkUserByEmail = require('../validator/checkUserByEmail');
const checkUserByEmailAndPassword = require('../validator/checkUserByEmailAndPassword');
const validateToken = require('../validator/validateToken');

const user = require('../controller/UserController');
const driver = require('../controller/DriverController');
const identity = require('../controller/IdentityController');

module.exports = app => {
  const router = require('express').Router();

  const handlerResponse = (req, res) => {
    const { statusCode, ...otherFields } = res.customResponse;
    res.status(statusCode).send(otherFields);
  };

  // user-microservice 
  app.use('/', router);
  router.post('/users', user.signUp, handlerResponse);
  router.get('/users/', validateToken, user.findAllUsers, handlerResponse);
  router.get('/users/:id', validateToken, user.findUserById, handlerResponse);
  router.patch('/users/:id', validateToken, user.patchUserById, handlerResponse);
  router.delete('/users/:id', validateToken, user.removeUserById, handlerResponse);

  // driver
  router.post('/users/:userId/driver', validateToken, driver.associateDriverToUser, handlerResponse);
  router.get('/users/:userId/driver', validateToken, driver.findAllDrivers, handlerResponse);
  router.get('/users/:userId/driver/:driverId', validateToken, driver.findDriverById, handlerResponse);
  router.patch('/users/:userId/driver/:driverId', validateToken, driver.patchDriverById, handlerResponse);
  router.delete('/users/:userId/driver/:driverId', validateToken, driver.removeDriverById, handlerResponse);

  // credential-microservice
  router.post('/login', checkUserByEmailAndPassword, identity.signIn, handlerResponse);
  router.post('/recover', checkUserByEmail, identity.sendEmail, handlerResponse);
  router.post('/logout', validateToken, identity.signOut, handlerResponse);
};