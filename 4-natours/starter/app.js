const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

const customMiddleware = {
  preMiddleware: [],
  postMiddleware: [],
  preRouter: [],
  postRouter: [],
  preErrorHandler: []
};

module.exports.customMiddleware = customMiddleware;

const {
  preMiddleware,
  postMiddleware,
  preRouter,
  postRouter,
  preErrorHandler
} = customMiddleware;

function initialize() {
  // 1) MIDDLEWARES

  preMiddleware.forEach(middleware => app.use(middleware));

  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

  app.use(express.json());
  app.use(express.static(`${__dirname}/public`));

  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();

    next();
  });

  postMiddleware.forEach(middleware => app.use(middleware));

  preRouter.forEach(middleware => app.use(middleware));

  // 2) ROUTES (End request/response cycle)

  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);

  postRouter.forEach(middleware => app.use(middleware));

  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  preErrorHandler.forEach(middleware => app.use(middleware));

  app.use(errorHandler);

  return app;
}

module.exports.initialize = initialize;
module.exports.app = app;
