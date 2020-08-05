const { getAllUsers } = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('./sendResponse');

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await getAllUsers();

  sendResponse(res, 200, { users }, { results: users.length });
});

module.exports.updateUser = (req, res) => {};

module.exports.deleteUser = (req, res) => {};
