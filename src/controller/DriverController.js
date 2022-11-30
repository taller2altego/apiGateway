const { endpoints } = require('config');
const handlerResponse = require('../utils/handlerResponse');
const { post, get, patch, remove } = require('../utils/axios');

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
    return get(`${url}/drivers`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  findDriverById(req, res, next) {
    const url = process.env.user_microservice || endpoints.driverMicroservice;
    return get(`${url}/drivers/${req.params.driverId}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchDriverById(req, res, next) {
    const urlDrivers = process.env.user_microservice || endpoints.driverMicroservice;
    return patch(`${urlDrivers}/drivers/${req.params.driverId}`, req.body)
      .then(async (axiosResponse) => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  patchDriverOnPayment(req, res, next) {
    const urlDrivers = process.env.user_microservice || endpoints.driverMicroservice;
    const urlUsers = process.env.user_microservice || endpoints.driverMicroservice;
    const urlWallet = process.env.paymentMicroservice || endpoints.paymentMicroservice;
    const body = {
      balance: req.body.balance,
      withdrawFunds: req.body.withdrawFunds
    };
    
    return patch(`${urlDrivers}/drivers/${req.params.driverId}`, body)
      .then(async (axiosResponse) => {
        if (req.body.withdrawFunds) {
          const user = await get(`${urlUsers}/users/${req.body.userId}`);
          console.log(req.body.balance);
          console.log(req.body.balance);
          console.log(req.body.balance);
          console.log(req.body.balance);
          return post(`${urlWallet}/payments/pay/${user.data.email}`, {
            amountInEthers: req.body.balance.toString()
          })
            .then(() => {
              return handlerResponse(axiosResponse);
            })
            .catch((error) => {
              console.log("ACADSDSDAD");
              console.log(error);
              return handlerResponse(error);
            })
        }
      })
      .catch(error => {
        console.log("ACADSDSDAD");
        console.log(error);
        return handlerResponse(error);
      })
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  removeDriverById(req, res, next) {
    const url = process.env.user_microservice || endpoints.driverMicroservice;
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