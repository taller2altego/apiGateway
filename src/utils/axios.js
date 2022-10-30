const { default: axios } = require("axios");

const post = (url, body, headers, params) => axios.post(
  url,
  body, {
  headers: {
    'Content-Type': 'application/json',
    ...headers
  },
  params
});

const get = (url, params, headers) => axios.get(url, { headers: { ...headers }, params });

const patch = (url, body, headers, params) => axios.patch(url, body, { headers: { ...headers }, params });

const remove = (url, params) => axios.delete(
  url,
  { params }
);

module.exports = { post, get, patch, remove };