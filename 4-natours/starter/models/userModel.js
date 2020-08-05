const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 18,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'Email is invalid!'],
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true
  },
  photo: String,
  password: {
    type: String,
    minlength: 8,
    maxlength: 16,
    required: [true, 'Please provide a password'],
    select: false
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: 'Password fields do not match.'
    },
    required: [true, 'Please confirm your password']
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    this.passwordChangedAt = Date.now();
  }

  next();
});

userSchema.post('save', async function (doc, next) {
  doc.password = undefined;
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);

    return changedTimestamp > JWTTimestamp;
  }

  return false;
};

const User = mongoose.model('User', userSchema);

exports.createUser = async user => {
  const newUser = await User.create(user);

  return newUser;
};

exports.getUser = async (data, includePassword = false) => {
  let user = await (includePassword
    ? User.findOne(data).select('+password')
    : User.findOne(data));

  await user;

  return user;
};

exports.getAllUsers = async () => {
  const users = await User.find();

  return users;
};

exports.getUserById = async (id, includePassword = false) => {
  const user = await (includePassword
    ? User.findById(id).select('+password')
    : User.findById(id));

  return user;
};
