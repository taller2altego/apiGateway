const { default: axios } = require("axios");
const logger = require("../../winston");
const { post } = require('../utils/axios');

class UserController {
  async signUp(req, res, next) {
    return post("http://user_microservice:5000/users", req.body)
      .then(response => {
        console.debug('aca no');
        console.debug(response);
        console.debug(response.status);
        console.debug(response.data);
        res.customResponse = { statusCode: 200, ...response.data };
        next();
      })
      .catch(err => {
        logger.error('falla aca');
        logger.error(JSON.stringify(err, null, 2));
        res.customResponse = { statusCode: err.status, message: 'err.response' };
        next();
      });
  }

  async findAllUsers(req, res, next) {
    axios.get("localhost:5000/users")
      .then(resp => {
        console.log(res.data);
      });
    next();
  }

  async findUserById(req, res, next) {
    // const config = {id: req.params.id};
    // axios.get("localhost:5000/users", config)
    // .then(res => {
    //   console.log(res.data);
    // });
  }

  async patchUserById(req, res, next) {
    // const config = {id: req.params.id, body: req.body};
    // axios.get("localhost:5000/users/:id", config)
    // .then(res => {
    //   console.log(res.data);
    // });
  }

  async removeUserById(req, res, next) {
  }

  // async changePasswordByUsername(req, res, next) {
  // }
}

module.exports = new UserController();