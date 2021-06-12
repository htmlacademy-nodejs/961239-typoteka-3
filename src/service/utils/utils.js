'use strict';

module.exports.requestHandler = (response, cb, requestData = null) => {
  const result = cb(requestData);
  return response.status(result.status).send(result.content);
};
