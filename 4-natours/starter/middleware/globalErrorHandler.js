const AppError = require('./../utils/appError');

module.exports = (err, req, res, next) => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV == 'production') {
    if (err.name == 'JsonWebTokenError') return next(handleJWTError(err));
    if (err.name == 'TokenExpiredError')
      return next(handleTokenExpiredError(err));
  }

  next(err);
};

const handleJWTError = error =>
  new AppError('Invalid token. Please log in again!', 401);

const handleTokenExpiredError = err =>
  new AppError('Your token has expired! Please log in again.', 401);
