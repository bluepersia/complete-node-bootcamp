const fs = require('fs');
const catchAsync = require('./catchAsync');
const sendResponse = require('./sendResponse');
const AppError = require('../utils/appError');
const {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan
} = require('../models/tourModel');

let tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);

function writeTours(callback) {
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    callback
  );
}

module.exports.getAllTours = catchAsync(async (req, res, next) => {
  const tours = await getAllTours(req.query);

  sendResponse(res, 200, { tours }, { results: tours.length });
});

module.exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await createTour(req.body);

  if (!tour) return next(new AppError(`Failed to create tour!`, 500));

  sendResponse(res, 201, { tour });
});

module.exports.getTour = catchAsync(async (req, res, next) => {
  const {
    params: { id }
  } = req;

  const tour = await getTour(id);

  if (!tour) return next(new AppError(`ID ${id} doesn't exist`, 404));

  sendResponse(res, 200, { tour });
});

module.exports.updateTour = catchAsync(async (req, res, next) => {
  const {
    params: { id },
    body
  } = req;

  const tour = await updateTour(id, body);

  if (!tour) return next(new AppError(`ID ${id} doesn't exist`, 404));

  sendResponse(res, 200, { tour });
});

module.exports.deleteTour = catchAsync(async (req, res, next) => {
  const {
    params: { id }
  } = req;

  const tour = await deleteTour(id);

  if (!tour) return next(new AppError(`ID ${id} doesn't exist`, 404));

  sendResponse(res, 204);
});

module.exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await getTourStats();

  sendResponse(res, 200, { stats });
});

module.exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = Number(req.params.year);

  const plan = await getMonthlyPlan(year);

  sendResponse(res, 200, { plan });
});

module.exports.aliasTopTours = (req, res, next) => {
  const { query } = req;

  query.limit = 5;
  query.sort = '-ratingsAverage,price';
  query.fields = 'name, price, ratingsAverage, summary, difficulty';

  next();
};
