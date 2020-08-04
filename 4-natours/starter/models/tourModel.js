const mongoose = require('mongoose');
const slugify = require('slugify');
const QueryBuilder = require('./queryBuilder');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must not exceed a length of 40 characters'],
      minlength: [10, 'A tour name must have at least 10 characters']
    },
    slug: {
      type: String,
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
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be at least 1.0'],
      max: [5, 'A rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only points to current doc on NEW documents
          return val < this.price;
        },
        message: 'Discount ({VALUE}) should be lower than the price'
      }
    },
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
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//VIRTUAL FIELDS
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE
//save only on save() and create (), NOT on update ()!
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

//QUERY MIDDLEWARE

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  const end = Date.now() - this.start;

  console.log(`Query took ${end} milliseconds`);

  next();
});

//AGGREGATION MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
  this._pipeline.unshift({
    $match: { secretTour: { $ne: true } }
  });
  next();
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

  if (!tour) throw new Error('Invalid ID!');

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
      $addFields: {
        year: { $year: '$startDates' }
      }
    },
    {
      $match: { year }
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
