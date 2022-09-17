const { default: axios } = require("axios");
const logger = require("../../winston");
const { post } = require('../utils/axios');

class UserController {
  async signUp(req, res, next) {
    return post("http://user_microservice:5000/users", req.body)
      .then(response => {
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        res.customResponse = handlerError(err);
        next();
      });
  }

  async findAllUsers(req, res, next) {
    // OK
    // return post("http://user_microservice:5000/token", req)
    // .then(response => {
    //   if (response.statusCode == 403){
    //     console.log(response);
    //     res.customResponse = { statusCode: 403, message: response.message };
    //     // next();
    //   }
    // });
    return axios.get("http://user_microservice:5000/users")
      .then(response => {
        console.log(response.data);
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        logger.error(JSON.stringify(err, null, 2));
        res.customResponse = { statusCode: err.status, message: 'err.response' };
        next();
      });
  }

  async findUserById(req, res, next) {
    // OK
    return axios.get("http://user_microservice:5000/users/" + req.params.id, req.body)
      .then(response => {
        console.log(response.data);
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        logger.error(JSON.stringify(err, null, 2));
        // TODO: lo arreglo yo ahora
        res.customResponse = { statusCode: err.status, message: 'err.response' };
        next();
      });
  }

  async patchUserById(req, res, next) {
    return axios.patch("http://user_microservice:5000/users/" + req.params.id, req.body)
      .then(response => {
        console.log(response.data);
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        logger.error(JSON.stringify(err, null, 2));
        // TODO: lo arreglo yo ahora
        res.customResponse = { statusCode: err.status, message: 'err.response' };
        next();
      });
  }

  async removeUserById(req, res, next) {
    return axios.delete("http://user_microservice:5000/users/" + req.params.id)
      .then(response => {
        console.log(response.data);
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        logger.error(JSON.stringify(err, null, 2));
        res.customResponse = { statusCode: err.status, message: 'err.response' };
        next();
      });
  }

  async changePasswordByUsername(req, res, next) {
    return axios.post("http://user_microservice:5000/reset_password", req.body)
      .then(response => {
        console.log(response.data);
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        logger.error(JSON.stringify(err, null, 2));
        res.customResponse = { statusCode: err.status, message: 'err.response' };
        next();
      });
  }
}

module.exports = new UserController();