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
    const urlTravels = process.env.travel_microservice || endpoints.travelMicroservice;
    const urlWallet = process.env.paymentMicroservice || endpoints.paymentMicroservice;
    const urlUsers = process.env.user_microservice || endpoints.userMicroservice;

    const email = req.body.email;
    const payWithWallet = req.body.payWithWallet;
    delete req.body.email;
    delete req.body.payWithWallet;
    const bodyDeposit = {
      amountInEthers: req.body.price.toString(),
    };

    const payment = payWithWallet ? function pay() {
      return patch(`${urlUsers}/users/${req.body.userId}`, { amount: req.body.price, isTransaction: true, withdrawFunds: true });
    } : function pay() {
      return post(`${urlWallet}/payments/deposit/${email}`, bodyDeposit);
    };

    const refund = payWithWallet ? function refund() {
      return patch(`${urlUsers}/users/${req.body.userId}`, { amount: req.body.price, isTransaction: true, withdrawFunds: false });
    } : function refund() {
      return post(`${urlWallet}/payments/pay/${email}`, bodyDeposit);
    };

    return payment()
      .then(() => {
        return post(`${urlTravels}/travels`, req.body)
          .then(axiosResponse => handlerResponse(axiosResponse))
          .catch(error => {
            return refund()
              .then(() => {
                logger.error(JSON.stringify(error, undefined, 2));
                return handlerResponse(error);
              })
              .catch(error => {
                logger.error(JSON.stringify(error, undefined, 2));
                return handlerResponse(error);
              });
          })
          .then(response => {
            res.customResponse = response;
            next();
          });
      })
      .catch(error => {
        logger.error(JSON.stringify(error, undefined, 2));
        res.customResponse = handlerResponse(error);
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
      const urlWallet = process.env.paymentMicroservice || endpoints.paymentMicroservice;

      return post(`${url}/travels/${req.params.travelId}/${state}`, req.body)
        .then(async (axiosResponse) => {
          if (state == 'reject' || state == 'finish') {
            await post(`${urlWallet}/payments/pay/${req.body.email}`, { amountInEthers: req.body.price })
              .then(() => {
                handlerResponse(axiosResponse)
              })
              .catch((error) => {
                logger.error(JSON.stringify(error, undefined, 2));
                return handlerResponse(error);
              });
          }
          return handlerResponse(axiosResponse)
        })
        .catch((error) => {
          logger.error(JSON.stringify(error, undefined, 2));
          return handlerResponse(error);
        })
        .then((response) => {
          res.customResponse = response;
          next();
        });
    }
  }

  findTravelById(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url} /travels/${req.params.travelId} `, req.body)
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
    return get(`${url} /travels/${req.params.travelId} /driver`)
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