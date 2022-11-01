module.exports = (axiosResponse, dataToMerge = {}, fieldsToKeep = []) => {
  if (axiosResponse.response) {
    return { statusCode: axiosResponse.response.status, ...axiosResponse.response.data };
  } else if (axiosResponse.code === 'ENOTFOUND') {
    return { statusCode: 503, message: 'Service unavailable' };
  } else if (axiosResponse.data) {
    try {
      const dataToBeSent = { ...axiosResponse.data, ...dataToMerge };
      const response = Object.keys(dataToBeSent)
        .filter(element => fieldsToKeep.length == 0 || fieldsToKeep.includes(element))
        .reduce((acum, current) => ({ ...acum, [current]: dataToBeSent[current] }), {});

      return { statusCode: axiosResponse.status, ...response };
    } catch (err) {
      throw err;
    }
  } else {
    return { statusCode: 500, message: 'Unexpected error' };
  }
}