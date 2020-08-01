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

module.exports.checkID = (req, res, next, val) => {
  const tourIndex = tours.findIndex((tour) => tour.id === Number(val));
  if (tourIndex > -1) {
    req.tour = tours[tourIndex];
    req.tourIndex = tourIndex;
    next();
    return;
  }

  res.status(404).json({
    status: 'fail',
    message: 'Invalid ID',
  });
};

module.exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

module.exports.checkCreateBody = (req, res, next) => {
  const {
    body: { name, price },
  } = req;

  if (name && price) {
    next();
    return;
  }

  res.status(400).json({
    status: 'fail',
    message: 'Name and price were not provided.',
  });
};
module.exports.createTour = (req, res) => {
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

module.exports.getTour = (req, res) => {
  const { tour } = req;

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

module.exports.updateTour = (req, res) => {
  let { tour } = req;
  const { tourIndex } = req;

  tour = { ...tour, ...req.body };

  tours[tourIndex] = tour;

  writeTours((err) => {});

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

module.exports.deleteTour = (req, res) => {
  const { tour } = req;

  tours = tours.filter((t) => t != tour);

  writeTours((err) => {});
};
