const { endpoints } = require('config');

const { post, get, patch } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');
const logger = require('../../winston');

class TravelController {

  findTravels(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/travels`, req.query)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findTravelsById(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/travels/users/${req.params.userId}`, req.query)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  createTravel(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return post(`${url}/travels`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchTravel(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return patch(`${url}/travels/${req.params.travelId}`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchTravel(state) {
    return (req, res, next) => {
      const url = process.env.travel_microservice || endpoints.travelMicroservice;
      return patch(`${url}/travels/${req.params.travelId}/${state}`, req.body)
        .then(axiosResponse => handlerResponse(axiosResponse))
        .catch(error => {
          logger.error(JSON.stringify(error, undefined, 2));
          return handlerResponse(error);
        })
        .then(response => {
          res.customResponse = response;
          next();
        });
    }
  }

  findTravelById(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/travels/${req.params.travelId}`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  checkDriverConfirmation(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/travels/${req.params.travelId}/driver`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findFees(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/fees`, req.query)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findFee(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/fees/${req.params.feeId}`, req.query)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  createFee(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return post(`${url}/fees`, req.body, {}, req.params)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchFee(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return patch(`${url}/fees/${req.params.feeId}`, req.body, {}, { ...req.query })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  async getPrice(req, res, next) {
    try {
      const usersUrl = process.env.user_microservice || endpoints.userMicroservice;
      const seniority = await get(`${usersUrl}/users/${req.params.userId}`, { ...req.query })
        .then(axiosResponse => handlerResponse(axiosResponse))
        .then(response => {
          const { createdAt } = response;
          const result = new Date().getYear() - new Date(createdAt).getYear();
          return result;
        });

      const url = process.env.travel_microservice || endpoints.travelMicroservice;
      return get(`${url}/price`, { ...req.query, seniority })
        .then(axiosResponse => handlerResponse(axiosResponse))
        .catch(error => {
          logger.error(JSON.stringify(error, undefined, 2));
        })
        .then(response => {
          res.customResponse = response;
          next();
        });
    } catch (error) {
      logger.error(JSON.stringify(error, undefined, 2));

      res.customResponse = handlerResponse(error);
      next();
    }
  }
}

module.exports = new TravelController();