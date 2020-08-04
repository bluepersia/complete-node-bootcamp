const mongoose = require('mongoose');
const { customMiddleware } = require('./app');
const mongooseErrorHandler = require('./middleware/mongooseErrorHandler');

customMiddleware.preErrorHandler.push(mongooseErrorHandler);

require('./dotenvconfig');

const DB = process.env.DATABASE.replace(
  'PASSWORD',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successfull!');
  });
