const user = require('../controller/UserController');
const driver = require('../controller/DriverController');
const identity = require('../controller/IdentityController');
const TravelController = require('../controller/TravelController');
const Metrics = require('hot-shots');
const statsD = new Metrics()

// validators
const checkUserByEmail = require('../validator/checkUserByEmail');
const checkUserByEmailAndPassword = require('../validator/checkUserByEmailAndPassword');
const validateToken = require('../validator/validateToken');

// configs
const { constants: { OAuthMethod, CommonMethod } } = require('config');
const decryptToken = require('../validator/decryptToken');

module.exports = app => {
  const router = require('express').Router();

  const testingMetrics = (req, res) => {
    statsD.increment('loginUsers.emailAndPassword');
    statsD.increment('recoverPassword');
    statsD.increment('createdUsers.emailAndPassword');
    statsD.increment('blockedUsers');
    statsD.increment('loginUsers.oauth');
    statsD.increment('createdUsers.oauth');
    res.status(200).send({ message: 'Hola' });
  }

  const handlerResponse = (req, res) => {
    const { statusCode, ...otherFields } = res.customResponse;
    res.status(statusCode).send(otherFields);
  };

  const isUserCreation = (req, res, next) => {
    req.body.role = 'admin';
    validateToken(req, res, next);
  }

  const validateTokenUserCreation = (req, res, next) => {
    const adminCreation = req.query.adminCreation === 'true';
    return adminCreation ? isUserCreation(req, res, next) : next();
  }

  const checkAdminLogin = (req, res, next) => {
    if (req.query.isBackoffice === 'true' && req.customBody.isAdmin == false) {
      res.status(401).send({ message: 'unauthorized' });
      return;
    } else {
      next();
    }
  }

  // user-microservice
  app.use('/', router);
  router.post('/users/changePassword', validateToken, user.changePassword, handlerResponse)
  router.post('/users', validateTokenUserCreation, user.signUp, handlerResponse);
  router.get('/users/', validateToken, user.findAllUsers, handlerResponse);
  router.get('/users/:id', validateToken, user.findUserById, handlerResponse);
  router.patch('/users/:id', validateToken, user.patchUserById, handlerResponse);
  router.delete('/users/:id', validateToken, user.removeUserById, handlerResponse);

  // driver
  router.post('/users/:userId/driver', validateToken, driver.associateDriverToUser, handlerResponse);
  router.get('/drivers', validateToken, driver.findAllDrivers, handlerResponse);
  router.get('/drivers/:driverId', validateToken, driver.findDriverById, handlerResponse);
  router.patch('/drivers/:driverId', validateToken, driver.patchDriverById, handlerResponse);
  router.delete('/drivers/:driverId', validateToken, driver.removeDriverById, handlerResponse);

  // credential-microservice
  router.post('/login/oauth', decryptToken, checkUserByEmailAndPassword(OAuthMethod), identity.signIn, handlerResponse);
  router.post('/login', checkUserByEmailAndPassword(CommonMethod), checkAdminLogin, identity.signIn, handlerResponse);
  router.post('/recover', checkUserByEmail, identity.sendEmail, handlerResponse);
  router.post('/logout', validateToken, identity.signOut, handlerResponse);

  // travel
  router.get('/travels', validateToken, TravelController.findTravels, handlerResponse);
  router.post('/travels', validateToken, TravelController.createTravel, handlerResponse);
  router.patch('/travels/:travelId', validateToken, TravelController.patchTravel, handlerResponse);
  router.get('/travels/:travelId', validateToken, TravelController.findTravelById, handlerResponse);
  router.get('/travels/:travelId/driver', validateToken, TravelController.checkDriverConfirmation, handlerResponse);
  router.get('/travels/users/:userId', validateToken, TravelController.findTravelsById, handlerResponse);

  router.post('/travels/:travelId/accept', validateToken, TravelController.patchTravelByState('accept'), handlerResponse);
  router.post('/travels/:travelId/reject', validateToken, TravelController.patchTravelByState('reject'), handlerResponse);
  router.post('/travels/:travelId/start', validateToken, TravelController.patchTravelByState('start'), handlerResponse);
  router.post('/travels/:travelId/finish', validateToken, TravelController.patchTravelByState('finish'), handlerResponse);

  // fees (travels)
  router.get('/fees', validateToken, TravelController.findFees, handlerResponse);
  router.get('/fees/:feeId', validateToken, TravelController.findFee, handlerResponse);
  router.post('/fees', validateToken, TravelController.createFee, handlerResponse);
  router.patch('/fees/:feeId', validateToken, TravelController.patchFee, handlerResponse);

  router.get('/price/:userId', validateToken, TravelController.getPrice, handlerResponse);

  //metric test
  router.get('/metric_test', testingMetrics)
};