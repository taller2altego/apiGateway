const { endpoints } = require('config');
const handlerResponse = require('../utils/handlerResponse');
const metricProducer = require('../utils/metricProducer');

const {
  post, get, patch, remove
} = require('../utils/axios');

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
    const url = process.env.driver_microservice || endpoints.driverMicroservice;
    return get(`${url}/drivers`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findDriverById(req, res, next) {
    const url = process.env.driver_microservice || endpoints.driverMicroservice;
    return get(`${url}/drivers/${req.params.driverId}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findAllReportsByDriverId(req, res, next) {
    const url = process.env.driver_microservice || endpoints.driverMicroservice;
    return get(`${url}/drivers/${req.params.driverId}/reports`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchDriverById(req, res, next) {
    const url = process.env.driver_microservice || endpoints.driverMicroservice;
    return patch(`${url}/drivers/${req.params.driverId}`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  async patchDriverOnPayment(req, res, next) {
    const urlDrivers = process.env.driver_microservice || endpoints.driverMicroservice;
    const urlUsers = process.env.user_microservice || endpoints.userMicroservice;
    const urlWallet = process.env.paymentMicroservice || endpoints.paymentMicroservice;
    const body = {
      isTransaction: req.body.isTransaction,
      balance: req.body.balance,
      withdrawFunds: req.body.withdrawFunds
    };

    const user = await get(`${urlUsers}/users/${req.body.userId}`);

    return patch(`${urlDrivers}/drivers/${user.data.driverId}`, body)
      .then(async axiosResponse => {
        if (req.body.withdrawFunds) {
          return post(`${urlWallet}/payments/pay/${user.data.email}`, { amountInEthers: req.body.balance.toString() })
            .then(() => {
              metricProducer(JSON.stringify({ metricName: 'payments.chargeDone', metricType: 'increment' }));
              return handlerResponse(axiosResponse);
            })
            .catch(error => handlerResponse(error));
        }
        return handlerResponse(axiosResponse);
      })
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  removeDriverById(req, res, next) {
    const url = process.env.driver_microservice || endpoints.driverMicroservice;
    return remove(`${url}/drivers/${req.params.driverId}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }
}

module.exports = new DriverController();
