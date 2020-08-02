const fs = require('fs');
require('../../database');
const { createTour, deleteAll } = require('../../models/tourModel.js');

if (process.argv.includes('--delete')) {
  deleteAll();
  process.exit();
  return;
}

const toursSimple = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

if (process.argv.includes('--import')) createTour(toursSimple);

process.exit();
