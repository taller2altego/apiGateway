const { endpoints } = require('config');

const {
  post, get
} = require('../utils/axios');
const handlerResponse = require('../utils/handlerResponse');

class CommentController {
  getUserCommentsById(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return get(`${url}/comments/user/${req.params.id}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  getDriverCommentsById(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return get(`${url}/comments/driver/${req.params.id}`)
      .then(axiosResponse => handlerResponse(axiosResponse))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  createUserComment(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return post(`${url}/comments/user`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse, {}))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }

  createDriverComment(req, res, next) {
    const url = process.env.user_microservice || endpoints.userMicroservice;
    return post(`${url}/comments/driver`, req.body)
      .then(axiosResponse => handlerResponse(axiosResponse, {}))
      .catch(error => handlerResponse(error))
      .then(response => {
        res.customResponse = response;
        next();
      });
  }
}

module.exports = new CommentController();
