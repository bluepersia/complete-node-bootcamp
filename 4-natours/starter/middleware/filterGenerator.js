const excludedFields = ['page', 'sort', 'limit', 'fields'];

module.exports = function (req, res, next) {
  const paramsFilter = { ...req.query };

  for (const excludedField of excludedFields)
    delete paramsFilter[excludedField];

  req.paramsFilter = paramsFilter;

  next();
};
