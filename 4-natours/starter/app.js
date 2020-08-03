const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

function initialize() {
  //NOTE: Export App so that we can apply more middleware before ending the request/response cycle

  // 2) ROUTES (End request/response cycle)

  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);

  return app;
}

module.exports.initialize = initialize;
module.exports.app = app;
