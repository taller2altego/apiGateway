const { post, get, patch, remove } = require('../utils/axios');
const handlerError = require('../utils/handlerError');


class DriverController {
  async associateDriverToUser(req, res, next) {
    const response = await post(`http://user_microservice:5000/users/${req.params.userId}/driver`, req.body)
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));
    res.customResponse = response;
    next();
  }

  async findAllDrivers(req, res, next) {
    const response = await get(`http://user_microservice:5000/users/${req.params.userId}/driver`)
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));
    res.customResponse = response;
    next();
  }

  async findDriverById(req, res, next) {
    const response = await get(`http://user_microservice:5000/users/${req.params.userId}/driver/${req.params.driverId}`)
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));
    res.customResponse = response;
    next();
  }

  async patchDriverById(req, res, next) {
    const response = await patch(`http://user_microservice:5000/users/${req.params.userId}/driver/${req.params.driverId}`, req.body)
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));
    res.customResponse = response;
    next();
  }

  async removeDriverById(req, res, next) {
    const response = await remove(`http://user_microservice:5000/users/${req.params.userId}/driver/${req.params.driverId}`)
      .then(response => ({ statusCode: 200, ...response.data }))
      .catch(err => handlerError(err));
    res.customResponse = response;
    next();
  }
}

module.exports = new DriverController();