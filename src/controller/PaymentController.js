const { endpoints } = require('config');
const handlerResponse = require('../utils/handlerResponse');
const { post } = require('../utils/axios');

class PaymentController {
  deposit(req, res, next) {
    const url = process.env.paymentMicroservice || endpoints.paymentMicroservice;
    const bodyDeposit = {
      amountInEthers: req.body.amount.toString(),
    };
    return post(`${url}/payments/deposit/${req.params.email}`, bodyDeposit)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  pay(req, res, next) {
    const url = process.env.paymentMicroservice || endpoints.paymentMicroservice;
    const bodyDeposit = {
      amountInEthers: req.body.amount.toString(),
    };
    return post(`${url}/payments/pay/${req.params.email}`, bodyDeposit)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }
}

module.exports = new PaymentController();