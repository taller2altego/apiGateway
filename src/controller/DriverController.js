const { endpoints } = require('config');

const { post, get, patch, remove } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');

class DriverController {
  associateDriverToUser(req, res, next) {
    const url = process.env.driver_microservice || endpoints.driverMicroservice;
    return post(`${url}/users/${req.params.userId}/driver`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  async findAllDrivers(req, res, next) {
    const url = process.env.user_microservice || endpoints.driverMicroservice;
    return get(`${url}/users/${req.params.userId}/driver`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findDriverById(req, res, next) {
    const url = process.env.user_microservice || endpoints.driverMicroservice;
    return get(`${url}/users/${req.params.userId}/driver/${req.params.driverId}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchDriverById(req, res, next) {
    const url = process.env.user_microservice || endpoints.driverMicroservice;
    return patch(`${url}/users/${req.params.userId}/driver/${req.params.driverId}`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  removeDriverById(req, res, next) {
    const url = process.env.user_microservice || endpoints.driverMicroservice;
    return remove(`${url}/users/${req.params.userId}/driver/${req.params.driverId}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }
}

module.exports = new DriverController();