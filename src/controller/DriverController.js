const { endpoints: { driverMicroservice } } = require('config');

const { post, get, patch, remove } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');

class DriverController {
  associateDriverToUser(req, res, next) {
    return post(`${driverMicroservice}/users/${req.params.userId}/driver`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  async findAllDrivers(req, res, next) {
    return get(`${driverMicroservice}/users/${req.params.userId}/driver`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findDriverById(req, res, next) {
    return get(`${driverMicroservice}/users/${req.params.userId}/driver/${req.params.driverId}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchDriverById(req, res, next) {
    return patch(`${driverMicroservice}/users/${req.params.userId}/driver/${req.params.driverId}`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  removeDriverById(req, res, next) {
    return remove(`${driverMicroservice}/users/${req.params.userId}/driver/${req.params.driverId}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }
}

module.exports = new DriverController();