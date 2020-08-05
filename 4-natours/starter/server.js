const globalErrorHandler = require('./middleware/globalErrorHandler');

function close() {
  if (server) {
    server.close(() => {
      process.exit(1);
    });

    return;
  }

  process.exit(1);
}

process.on('uncaughtException', err => {
  console.error(err);
  console.log('UNHANDLED EXCEPTION! Shutting down...');

  close();
});

require('./dotenvconfig');

require('./database');

const { customMiddleware, initialize, app } = require('./app');

customMiddleware.preErrorHandler.push(globalErrorHandler);

initialize();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.error(err);
  console.log('UNHANDLED REJECTION! Shutting down...');

  close();
});
