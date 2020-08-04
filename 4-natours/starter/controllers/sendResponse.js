module.exports = function (res, statusCode, data = null, restData) {
  res.status(statusCode).json({
    status: 'success',
    data,
    ...restData
  });
};
