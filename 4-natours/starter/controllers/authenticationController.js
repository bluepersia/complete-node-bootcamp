const { signUp } = require('../models/userModel');
const sendResponse = require('./sendResponse');
const catchAsync = require('./catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await signUp(req.body);

  sendResponse(res, 201, { user: newUser });
});
