const AppError = require('./../utils/appError');

module.exports = (err, req, res, next) => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV == 'production') {
    if (err.name == 'CastError') return next(handleCastErrorDB(err));
    if (err.code == 11000) return next(handleDuplicateFields(err));

    if (err._message && err._message.includes('validation'))
      return next(handleValidationError(err));
  }

  next(err);
};

function handleCastErrorDB(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
}

function handleDuplicateFields(err) {
  return new AppError(
    `Duplicate field value: ${err.keyValue.name}. Please use another value!`,
    400
  );
}

function handleValidationError(err) {
  const messages = Object.values(err.errors).map(
    ({ properties }) => properties.message
  );

  return new AppError(messages.join('. '), 400);
}
