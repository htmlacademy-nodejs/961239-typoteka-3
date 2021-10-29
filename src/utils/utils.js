'use strict';

const prepareErrors = (errors) => {
  console.log(errors.response.data);
  errors.response.data.split(`\n`);
};

module.exports = {prepareErrors};
