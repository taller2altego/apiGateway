const { default: axios } = require("axios");
const logger = require("../../winston");
const { post, get, patch, remove } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');
const jwt = require('jsonwebtoken');

class TravelController {

  findTravels(req, res, next) {
    console.log(req.query);
    return get('http://travel_microservice:5000/travels', req.query)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findTravelsById(req, res, next) {
    return get(`http://travel_microservice:5000/travels/users/${req.params.userId}`, req.query)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  createTravel(req, res, next) {
    return post(`http://travel_microservice:5000/travels`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchTravel(req, res, next) {
    return patch(`http://travel_microservice:5000/travels/${req.params.travelId}`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  checkDriverConfirmation(req, res, next) {
    return get(`http://travel_microservice:5000/travels/${req.params.travelId}/driver`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }
}

module.exports = new TravelController();