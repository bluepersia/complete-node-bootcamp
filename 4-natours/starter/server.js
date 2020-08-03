require('./dotenvconfig');

require('./database');

const app = require('./app').initialize();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});