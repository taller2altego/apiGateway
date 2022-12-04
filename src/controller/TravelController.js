const { endpoints } = require('config');

const { post, get, patch } = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');
const logger = require('../../winston');
const metricProducer = require('../utils/metricProducer');

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
        metricProducer(JSON.stringify({ metricName: 'travel.createTravel', metricType: 'increment'}));
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

  patchTravelByState(state) {
    return (req, res, next) => {
      const url = process.env.travel_microservice || endpoints.travelMicroservice;
      return post(`${url}/travels/${req.params.travelId}/${state}`, req.body)
        .then(async axiosResponse => {
          if (state == 'finish'){
            await get(`${url}/travels/${req.params.travelId}`).then((data) => {
              var init = new Date(data.data.data.date);
              var finish = new Date()
              var diffMs = (finish - init);
              var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
              console.log(diffMins)
              metricProducer(JSON.stringify({ metricName: 'travel.duration', metricType: 'histogram', metricValue:diffMins }));
            })
          }
          return handlerResponse(axiosResponse)
        })
        .catch(error => {
          logger.error(JSON.stringify(error, undefined, 2));
          return handlerResponse(error);
        })
        .then(response => {
          res.customResponse = response;
          next();
        });
    };
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
          return handlerResponse(error);
        })
        .then(response => {
          res.customResponse = response;
          next();
        });
    } catch (error) {
      logger.error(JSON.stringify(error, undefined, 2));
      res.customResponse = handlerResponse(error);
      return next();
    }
  }

  test(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    console.log(req.query);
    return get(`${url}/travels/test`, { ...req.query })
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

module.exports = new TravelController();
