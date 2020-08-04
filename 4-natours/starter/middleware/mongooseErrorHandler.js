const AppError = require('./../utils/appError');

module.exports = (err, req, res, next) => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV == 'production') {
    if (err.name == 'CastError') return next(handleCastErrorDB(err));
  }

  next(err);
};

function handleCastErrorDB(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}.`, 500);
}
