module.exports = err => {
  if (err.response) {
    return { statusCode: err.response.status, ...err.response.data };
  } else if (err.code === 'ENOTFOUND') {
    return { statusCode: 503, message: 'Service unavailable' };
  }
}