module.exports = function (res, statusCode, data = undefined, restData) {
  res.status(statusCode).json({
    status: 'success',
    data,
    ...restData
  });
};
