const { default: axios } = require("axios");

const post = (url, body, headers) => axios.post(
  url,
  body, {
  headers: {
    'Content-Type': 'application/json',
    ...headers
  }
});

const get = (url, headers) => axios.get(url, { headers: { ...headers } });

const patch = (url, body, headers) => axios.patch(url, body, { headers: { ...headers } });

const remove = (url) => axios.delete(
  url
);

module.exports = { post, get, patch, remove };