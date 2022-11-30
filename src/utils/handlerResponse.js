module.exports = (axiosResponse, dataToMerge = {}, fieldsToKeep = []) => {
  if (axiosResponse.status === 204) {
    return { statusCode: 204 };
  } if (axiosResponse.response) {
    return { statusCode: axiosResponse.response.status, ...axiosResponse.response.data };
  } if (axiosResponse.code === 'ENOTFOUND') {
    return { statusCode: 503, message: 'Service unavailable' };
  } if (axiosResponse.data) {
    const dataToBeSent = { ...axiosResponse.data, ...dataToMerge };
    const response = Object.keys(dataToBeSent)
      .filter(element => fieldsToKeep.length === 0 || fieldsToKeep.includes(element))
      .reduce((acum, current) => ({ ...acum, [current]: dataToBeSent[current] }), {});

    return { statusCode: axiosResponse.status, ...response };
  }
  return { statusCode: 500, message: 'Unexpected error' };
};
