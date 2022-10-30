const { endpoints } = require('config');

const { post, get, patch } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');

class TravelController {

  findTravels(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/travels`, req.query)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findTravelsById(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/travels/users/${req.params.userId}`, req.query)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  createTravel(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return post(`${url}/travels`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchTravel(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return patch(`${url}/travels/${req.params.travelId}`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findTravelById(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/travels/${req.params.travelId}`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  checkDriverConfirmation(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/travels/${req.params.travelId}/driver`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }
}

module.exports = new TravelController();