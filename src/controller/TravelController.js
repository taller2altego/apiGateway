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
    const urlTravels = process.env.travel_microservice || endpoints.travelMicroservice;
    const urlWallet = process.env.paymentMicroservice || endpoints.paymentMicroservice;
    const urlUsers = process.env.user_microservice || endpoints.userMicroservice;

    const email = req.body.email.toString();
    const payWithWallet = req.body.paidWithCredits;
    delete req.body.email;
    const bodyDeposit = {
      amountInEthers: req.body.price.toString()
    };
    const payment = payWithWallet ? function pay() {
      return patch(`${urlUsers}/users/${req.body.userId}`, { balance: req.body.price, isTransaction: true, withdrawFunds: true });
    } : function pay() {
      return post(`${urlWallet}/payments/deposit/${email}`, bodyDeposit);
    };

    const refund = payWithWallet ? function refund() {
      return patch(`${urlUsers}/users/${req.body.userId}`, { balance: req.body.price, isTransaction: true, withdrawFunds: false });
    } : function refund() {
      return post(`${urlWallet}/payments/pay/${email}`, bodyDeposit);
    };

    return payment()
      .then(() => {
        metricProducer(JSON.stringify({ metricName: 'payments.payDone', metricType: 'increment' }));
        return post(`${urlTravels}/travels`, req.body)
          .then(axiosResponse => handlerResponse(axiosResponse))
          .catch(errorTravels => refund()
            .then(() => handlerResponse(errorTravels))
            .catch(errorPayments => handlerResponse(errorPayments)))
          .then(response => {
            res.customResponse = response;
            next();
          });
      })
      .catch(error => handlerResponse(error))
      .then(response => {
        metricProducer(JSON.stringify({ metricName: 'travel.createTravel', metricType: 'increment' }));
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

  patchTravelByState(state) {
    return (req, res, next) => {
      const url = process.env.travel_microservice || endpoints.travelMicroservice;
      const urlWallet = process.env.paymentMicroservice || endpoints.paymentMicroservice;
      const urlUsers = process.env.user_microservice || endpoints.userMicroservice;
      const urlDrivers = process.env.driver_microservice || endpoints.driverMicroservice;

      const pay = req.body.paidWithCredits ? function pay() {
        const patchURL = req.body.payToDriver ? `${urlDrivers}/drivers/${req.body.driverId}` : `${urlUsers}/users/${req.body.userId}`;
        return patch(patchURL, {
          balance: req.body.price,
          isTransaction: true,
          withdrawFunds: false
        });
      } : function pay() {
        return post(`${urlWallet}/payments/pay/${req.body.email}`, { amountInEthers: req.body.price.toString() });
      };

      return post(`${url}/travels/${req.params.travelId}/${state}`, req.body)
        .then(async axiosResponse => {
          if (state === 'reject' || state === 'finish') {
            if (state === 'finish') {
              await get(`${url}/travels/${req.params.travelId}`).then(data => {
                const init = new Date(data.data.data.date);
                const finish = new Date();
                const diffMs = (finish - init);
                const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                metricProducer(JSON.stringify({ metricName: 'travel.duration', metricType: 'histogram', metricValue: diffMins }));
              });
            }
            return pay()
              .then(() => handlerResponse(axiosResponse)).catch(error => handlerResponse(error));
          }
          return handlerResponse(axiosResponse);
        })
        .catch(error => handlerResponse(error))
        .then(response => {
          res.customResponse = response;
          next();
        });
    };
  }

  findTravelById(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/travels/${req.params.travelId}`)
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

  findFees(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/fees`, req.query)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findFee(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return get(`${url}/fees/${req.params.feeId}`, req.query)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  createFee(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return post(`${url}/fees`, req.body, {}, req.params)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchFee(req, res, next) {
    const url = process.env.travel_microservice || endpoints.travelMicroservice;
    return patch(`${url}/fees/${req.params.feeId}`, req.body, {}, { ...req.query })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
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
        .catch(error => handlerResponse(error))
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
    return get(`${url}/travels/test`, { ...req.query })
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }
}

module.exports = new TravelController();
