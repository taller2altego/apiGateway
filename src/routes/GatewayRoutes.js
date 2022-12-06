// const Metrics = require('hot-shots');
const { constants: { OAuthMethod, CommonMethod } } = require('config');
const router = require('express').Router();

const user = require('../controller/UserController');
const driver = require('../controller/DriverController');
const identity = require('../controller/IdentityController');
const TravelController = require('../controller/TravelController');
const CommentController = require('../controller/CommentController');

// validators
const checkUserByEmail = require('../validator/checkUserByEmail');
const checkUserByEmailAndPassword = require('../validator/checkUserByEmailAndPassword');
const validateToken = require('../validator/validateToken');

// configs
const decryptToken = require('../validator/decryptToken');
const PaymentController = require('../controller/PaymentController');
const metricProducer = require('../utils/metricProducer');

module.exports = app => {
  const testingMetrics = (req, res) => {
    metricProducer(JSON.stringify({ metricName: 'loginUsers.emailAndPassword', metricType: 'increment' }));
    metricProducer(JSON.stringify({ metricName: 'recoverPassword', metricType: 'increment' }));
    metricProducer(JSON.stringify({ metricName: 'createdUsers.emailAndPassword', metricType: 'increment' }));
    metricProducer(JSON.stringify({ metricName: 'blockedUsers', metricType: 'increment' }));
    metricProducer(JSON.stringify({ metricName: 'loginUsers.oauth', metricType: 'increment' }));
    metricProducer(JSON.stringify({ metricName: 'createdUsers.oauth', metricType: 'increment' }));
    metricProducer(JSON.stringify({ metricName: 'travel.createTravel', metricType: 'increment' }));
    metricProducer(JSON.stringify({ metricName: 'payments.payDone', metricType: 'increment' }));
    metricProducer(JSON.stringify({ metricName: 'payments.chargeDone', metricType: 'increment' }));
    metricProducer(JSON.stringify({ metricName: 'travel.duration', metricType: 'histogram', metricValue: Math.floor(Math.random() * 60) }));
    res.status(200).send({ message: 'Test Metrics DONE' });
  };

  const handlerResponse = (req, res) => {
    const { statusCode, ...otherFields } = res.customResponse;
    res.status(statusCode).send(otherFields);
  };

  const isUserCreation = (req, res, next) => {
    req.body.role = 'admin';
    validateToken(req, res, next);
  };

  const validateTokenUserCreation = (req, res, next) => {
    const adminCreation = req.query.adminCreation === 'true';
    return adminCreation ? isUserCreation(req, res, next) : next();
  };

  const checkAdminLogin = (req, res, next) => {
    if (req.query.isBackoffice === 'true' && req.customBody.isAdmin === false) {
      res.status(401).send({ message: 'unauthorized' });
    } else {
      next();
    }
  };

  // user-microservice
  app.use('/', router);

  router.get('/travels/test', TravelController.test, handlerResponse);

  router.post('/users/changePassword', validateToken, user.changePassword, handlerResponse);
  router.post('/users', validateTokenUserCreation, user.signUp, handlerResponse);
  router.post('/reports', validateToken, user.sendReport, handlerResponse);
  router.get('/users/', validateToken, user.findAllUsers, handlerResponse);
  router.get('/users/:id', validateToken, user.findUserById, handlerResponse);
  router.patch('/users/:id/location', validateToken, user.patchDefaultLocationByUserId, handlerResponse);
  router.patch('/users/:id', validateToken, user.patchUserById, handlerResponse);
  router.patch('/users/', user.patchUserByEmail, handlerResponse);

  // driver
  router.post('/users/:userId/driver', validateToken, driver.associateDriverToUser, handlerResponse);
  router.get('/drivers', validateToken, driver.findAllDrivers, handlerResponse);
  router.get('/drivers/:driverId', validateToken, driver.findDriverById, handlerResponse);
  router.get('/drivers/:driverId/reports', validateToken, driver.findAllReportsByDriverId, handlerResponse);

  router.patch('/drivers/:driverId', validateToken, driver.patchDriverById, handlerResponse);
  router.patch('/drivers/:driverId/payment', validateToken, driver.patchDriverOnPayment, handlerResponse);
  router.delete('/drivers/:driverId', validateToken, driver.removeDriverById, handlerResponse);

  // comments
  router.get('/comments/user/:id', validateToken, CommentController.getUserCommentsById, handlerResponse);
  router.get('/comments/driver/:id', validateToken, CommentController.getDriverCommentsById, handlerResponse);
  router.post('/comments/user', validateToken, CommentController.createUserComment, handlerResponse);
  router.post('/comments/driver', validateToken, CommentController.createDriverComment, handlerResponse);

  // credential-microservice
  router.post('/login/oauth', decryptToken, checkUserByEmailAndPassword(OAuthMethod), identity.signIn, handlerResponse);
  router.post('/login', checkUserByEmailAndPassword(CommonMethod), checkAdminLogin, identity.signIn, handlerResponse);
  router.post('/recover', checkUserByEmail, identity.sendEmail, handlerResponse);
  router.post('/logout', validateToken, identity.signOut, handlerResponse);
  router.post('/auth', identity.validateToken, handlerResponse);

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

  // metric test
  router.get('/metric_test', testingMetrics);

  // payments
  router.post('/payments/deposit/:email', validateToken, PaymentController.deposit, handlerResponse);
  router.post('/payments/pay/:email', validateToken, PaymentController.pay, handlerResponse);
};
