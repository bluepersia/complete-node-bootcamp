const mongoose = require('mongoose');
const QueryBuilder = require('./queryBuilder');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a max group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports.createTour = async function (tourData) {
  const newTour = await Tour.create(tourData);

  return newTour;
};

module.exports.getAllTours = async function (query) {
  const allTours = await new QueryBuilder(Tour.find(), query).BuildQuery()
    .baseQuery;

  return allTours;
};

module.exports.getTour = async function (id) {
  const tour = await Tour.findById(id);

  return tour;
};

module.exports.updateTour = async function (id, tour) {
  const updatedTour = await Tour.findByIdAndUpdate(id, tour, {
    new: true,
    runValidators: true
  });

  return updatedTour;
};

module.exports.deleteTour = async function (id) {
  await Tour.findByIdAndDelete(id);

  return true;
};

module.exports.deleteAll = async () => {
  await Tour.deleteMany();

  return true;
};

module.exports.getTourStats = async () => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: {
        avgPrice: 1
      }
    }
  ]);

  return stats;
};

module.exports.getMonthlyPlan = async (year = Date.now()) => {
  const monthlyPlan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    }
  ]);

  return monthlyPlan;
};