module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  const { NODE_ENV } = process.env;

  let json = {
    status,
    message: err.message
  };

  if (NODE_ENV == 'development') {
    //Send as much info as possible in development mode
    json.error = err;
    json.stack = err.stack;
  } else {
    //Do not share non-operational errors with clients
    if (!err.isOperational) {
      console.error('ERROR 💥', err);

      statusCode = 500;
      json = {
        status: 'error',
        message: 'Something went very wrong!'
      };
    }
  }

  res.status(statusCode).json(json);
};
