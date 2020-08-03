module.exports = function (req, res, next) {
  const { paramsFilter } = req;

  let paramsString = JSON.stringify(paramsFilter);

  paramsString = paramsString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    match => `$${match}`
  );

  req.paramsFilter = JSON.parse(paramsString);

  /*
  Object.entries(paramsFilter).forEach(([propertyName, propertyValue]) => {
    if (typeof propertyValue === 'string' && propertyValue.includes('_')) {
      const [operator, value] = propertyValue.split('_');

      const newParam = {
        [`$${operator}`]: value
      };

      paramsFilter[propertyName] = newParam;
    }
  });

  */

  next();
};
