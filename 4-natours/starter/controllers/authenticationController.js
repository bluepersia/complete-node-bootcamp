const { promisify } = require('util');
const { createUser, getUser, getUserById } = require('../models/userModel');
const sendResponse = require('./sendResponse');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

function createToken(id) {
  const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

exports.signUp = catchAsync(async (req, res, next) => {
  const {
    body: { name, email, password, passwordConfirm }
  } = req;
  const newUser = await createUser({ name, email, password, passwordConfirm });

  const token = createToken(newUser._id);

  sendResponse(res, 201, { user: newUser }, { token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password!', 400));

  const user = await getUser({ email }, true);

  const isPasswordCorrect = user && (await user.correctPassword(password));

  if (!user || !isPasswordCorrect)
    return next(new AppError('Incorrect email or password', 401));

  const token = createToken(user._id);

  sendResponse(res, 200, undefined, { token });
});

exports.protect = catchAsync(async function (req, res, next) {
  const { authorization } = req.headers;

  const token =
    authorization && authorization.startsWith('Bearer')
      ? authorization.split(' ')[1]
      : undefined;

  if (!token)
    return next(
      new AppError('Your are not logged in! Please log in to get access.', 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await getUserById(decoded.id);

  if (!user)
    return next(
      new AppError('User no longer exists. Please log in as a valid user.', 401)
    );

  const isPasswordChanged = user.changedPasswordAfter(decoded.iat);

  if (isPasswordChanged)
    return next(
      new AppError(
        'This token is no longer valid due to user changes. Please log in again.',
        401
      )
    );

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']

    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action.'),
        403
      );

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const {
    body: { email }
  } = req;
  //1) Get user based on POSTed email
  const user = await getUser({ email });
  if (!user)
    return next(new AppError('There is no user with that email address.', 404));

  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
});

exports.resetPassword = (req, res, next) => {};
