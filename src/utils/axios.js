const { default: axios } = require("axios");

const post = (url, body, headers) => axios.post(
  url,
  body, {
  headers: {
    'Content-Type': 'application/json',
    ...headers
  }
});

module.exports = { post };