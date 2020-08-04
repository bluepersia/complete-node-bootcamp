const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 8,
    maxLength: 18,
    validation: validator.isAlpha,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    validation: validator.isEmail,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true
  },
  photo: String,
  password: {
    type: String,
    minLength: 8,
    maxLength: 16,
    required: [true, 'Please provide a password']
  },
  passwordConfirm: {
    type: String,
    validation: {
      validator: function (val) {
        return val == this.password;
      },
      message: 'Password fields do not match.'
    },
    required: [true, 'Please confirm your password']
  }
});

const User = mongoose.model('User', userSchema);
