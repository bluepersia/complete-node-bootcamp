const fs = require('fs');
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

module.exports.getAllTours = async (req, res) => {
  try {
    const tours = await getAllTours(req.query);

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: String(err)
    });
  }
};

module.exports.checkCreateBody = (req, res, next) => {
  const {
    body: { name, price }
  } = req;

  if (name && price) {
    next();
    return;
  }

  res.status(400).json({
    status: 'fail',
    message: 'Name and price were not provided.'
  });
};
module.exports.createTour = async (req, res) => {
  try {
    const tour = await createTour(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: String(err)
    });
  }
};

module.exports.getTour = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;

    const tour = await getTour(id);

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid ID!'
    });
  }
};

module.exports.updateTour = async (req, res) => {
  try {
    const {
      params: { id },
      body
    } = req;

    const tour = await updateTour(id, body);

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: String(err)
    });
  }
};

module.exports.deleteTour = async (req, res) => {
  try {
    const {
      params: { id }
    } = req;

    await deleteTour(id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: String(err)
    });
  }
};

module.exports.getTourStats = async (req, res) => {
  try {
    const stats = await getTourStats();

    res.status(200).json({
      status: 'success',
      stats
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: String(err)
    });
  }
};

module.exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year);

    const plan = await getMonthlyPlan(year);

    res.status(200).json({
      status: 'success',
      plan
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: String(err)
    });
  }
};

module.exports.aliasTopTours = (req, res, next) => {
  const { query } = req;

  query.limit = 5;
  query.sort = '-ratingsAverage,price';
  query.fields = 'name, price, ratingsAverage, summary, difficulty';

  next();
};
