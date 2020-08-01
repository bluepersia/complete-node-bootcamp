const express = require('express');
const fs = require('fs');

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

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours = [...tours, newTour];

  writeTours((err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((t) => t.id == id);

  if (tour) {
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
    return;
  }

  res.status(404).json({
    status: 'fail',
    message: 'Invalid ID',
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;

  const tourIndex = tours.findIndex((t) => t.id == id);

  let tour = tours[tourIndex];

  if (tour) {
    tour = tours[tourIndex] = { ...tour, ...req.body };

    writeTours((err) => {});

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
    return;
  }

  res.status(404).json({
    status: 'fail',
    message: 'Invalid ID',
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  tours = tours.filter((tour) => tour.id != id);

  writeTours((err) => {});

  console.log(tours);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
