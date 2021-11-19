'use strict';

const auth = (req, res, next) => {
  const {user} = req.session;

  if (!user) {
    return res.redirect(`/login`);
  }
  return next();
};

const alreadyAuth = (req, res, next) => {
  const {user} = req.session;
  if (user) {
    return res.redirect(`/`);
  }
  return next();
};

const isAuthorAuth = (req, res, next) => {
  const {user} = req.session;
  if (!user) {
    return res.redirect(`/`);
  }
  if (!user.isAuthor) {
    return res.redirect(`/404`);
  }
  return next();
};

module.exports = {
  auth,
  alreadyAuth,
  isAuthorAuth
};
