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
const logger = require('../../winston');

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
    logger.info(`response: ${JSON.stringify(otherFields, undefined, 2)}`);
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

  const logInput = (req, res, next) => {
    if (req.query) {
      logger.info(`query: ${JSON.stringify(req.query, undefined, 2)}`);
    }

    if (req.params) {
      logger.info(`params: ${JSON.stringify(req.params, undefined, 2)}`);
    }

    if (req.body) {
      logger.info(`body: ${JSON.stringify(req.body, undefined, 2)}`);
    }
    next();
  };

  // user-microservice
  app.use('/', router);

  router.get('/travels/test', TravelController.test, handlerResponse);

  router.post('/users/changePassword', logInput, validateToken, user.changePassword, handlerResponse);
  router.post('/users', logInput, validateTokenUserCreation, user.signUp, handlerResponse);
  router.post('/reports', logInput, validateToken, user.sendReport, handlerResponse);
  router.get('/users/', logInput, validateToken, user.findAllUsers, handlerResponse);
  router.get('/users/:id', logInput, validateToken, user.findUserById, handlerResponse);
  router.patch('/users/:id/location', logInput, validateToken, user.patchDefaultLocationByUserId, handlerResponse);
  router.patch('/users/:id', logInput, validateToken, user.patchUserById, handlerResponse);
  router.patch('/users/', logInput, user.patchUserByEmail, handlerResponse);

  // driver
  router.post('/users/:userId/driver', logInput, validateToken, driver.associateDriverToUser, handlerResponse);
  router.get('/drivers', logInput, validateToken, driver.findAllDrivers, handlerResponse);
  router.get('/drivers/:driverId', logInput, validateToken, driver.findDriverById, handlerResponse);
  router.get('/drivers/:driverId/reports', logInput, validateToken, driver.findAllReportsByDriverId, handlerResponse);

  router.patch('/drivers/:driverId', logInput, validateToken, driver.patchDriverById, handlerResponse);
  router.patch('/drivers/:driverId/payment', logInput, validateToken, driver.patchDriverOnPayment, handlerResponse);
  router.delete('/drivers/:driverId', logInput, validateToken, driver.removeDriverById, handlerResponse);

  // comments
  router.get('/comments/user/:id', logInput, validateToken, CommentController.getUserCommentsById, handlerResponse);
  router.get('/comments/driver/:id', logInput, validateToken, CommentController.getDriverCommentsById, handlerResponse);
  router.post('/comments/user', logInput, validateToken, CommentController.createUserComment, handlerResponse);
  router.post('/comments/driver', logInput, validateToken, CommentController.createDriverComment, handlerResponse);

  // credential-microservice
  router.post('/login/oauth', logInput, decryptToken, checkUserByEmailAndPassword(OAuthMethod), identity.signIn, handlerResponse);
  router.post('/login', logInput, checkUserByEmailAndPassword(CommonMethod), checkAdminLogin, identity.signIn, handlerResponse);
  router.post('/recover', logInput, checkUserByEmail, identity.sendEmail, handlerResponse);
  router.post('/logout', logInput, validateToken, identity.signOut, handlerResponse);
  router.post('/auth', logInput, identity.validateToken, handlerResponse);

  // travel
  router.get('/travels', logInput, validateToken, TravelController.findTravels, handlerResponse);
  router.post('/travels', logInput, validateToken, TravelController.createTravel, handlerResponse);
  router.patch('/travels/:travelId', logInput, validateToken, TravelController.patchTravel, handlerResponse);
  router.get('/travels/:travelId', logInput, validateToken, TravelController.findTravelById, handlerResponse);
  router.get('/travels/:travelId/driver', logInput, validateToken, TravelController.checkDriverConfirmation, handlerResponse);
  router.get('/travels/users/:userId', logInput, validateToken, TravelController.findTravelsById, handlerResponse);

  router.post('/travels/:travelId/accept', logInput, validateToken, TravelController.patchTravelByState('accept'), handlerResponse);
  router.post('/travels/:travelId/reject', logInput, validateToken, TravelController.patchTravelByState('reject'), handlerResponse);
  router.post('/travels/:travelId/start', logInput, validateToken, TravelController.patchTravelByState('start'), handlerResponse);
  router.post('/travels/:travelId/finish', logInput, validateToken, TravelController.patchTravelByState('finish'), handlerResponse);

  // fees (travels)
  router.get('/fees', logInput, validateToken, TravelController.findFees, handlerResponse);
  router.get('/fees/:feeId', logInput, validateToken, TravelController.findFee, handlerResponse);
  router.post('/fees', logInput, validateToken, TravelController.createFee, handlerResponse);
  router.patch('/fees/:feeId', logInput, validateToken, TravelController.patchFee, handlerResponse);

  router.get('/price/:userId', logInput, validateToken, TravelController.getPrice, handlerResponse);

  // metric test
  router.get('/metric_test', logInput, testingMetrics);

  // payments
  router.post('/payments/deposit/:email', logInput, validateToken, PaymentController.deposit, handlerResponse);
  router.post('/payments/pay/:email', logInput, validateToken, PaymentController.pay, handlerResponse);
};
