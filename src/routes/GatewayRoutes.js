module.exports = app => { 
    const user = require('../controller/UserController');
    const identity = require('../controller/IdentityController')
    const router = require('express').Router();

    const handlerResponse = (req, res) => {
      const { statusCode, ...otherFields } = res.customResponse;
      res.status(statusCode).send(otherFields);
    };
    
    // user-microservice 
    app.use('/users', router);
    router.post('/', user.signUp, handlerResponse);
    router.patch('/:id', user.patchUserById, handlerResponse);
    router.get('/:id', user.findUserById, handlerResponse);
    router.get('/', user.findAllUsers, handlerResponse);
    router.delete('/:id', user.removeUserById, handlerResponse);
    // router.post('/reset_password', user.changePasswordByUsername, handlerResponse);

    // credential-microservice
    // app.use('/login', router);
    // router.post('/', identity.checkCredential, handlerResponse);
    // router.post('/', identity.singIn, handlerResponse);
    // app.use('/logout', router);
    // router.post('/', identity.singOut, handlerResponse);
  };