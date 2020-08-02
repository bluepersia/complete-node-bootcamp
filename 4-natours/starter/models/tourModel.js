const mongoose = require('mongoose');

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
    default: Date.now()
  },
  startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports.createTour = async function (tourData) {
  const newTour = await Tour.create(tourData);

  return newTour;
};

module.exports.getAllTours = async function () {
  const allTours = Tour.find();

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
