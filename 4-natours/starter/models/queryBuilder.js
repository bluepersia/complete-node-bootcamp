const MAX_LIMIT = 1000;

class QueryBuilder {
  constructor(baseQuery, { sort, fields, page = 1, limit = 100, ...filter }) {
    this.baseQuery = baseQuery;
    this.sort = parseSort(sort);
    this.fields = parseFields(fields);
    this.page = page;
    this.limit = Number(limit);

    this.filter = parseFilter(filter);
  }

  Filter() {
    if (this.filter) this.baseQuery.where(this.filter);

    return this;
  }

  Sort() {
    if (this.sort) this.baseQuery.sort(this.sort);
    else this.baseQuery.sort('-createdAt');

    return this;
  }

  SelectFields() {
    if (this.fields) this.baseQuery.select(this.fields);
    else this.baseQuery.select('-__v');

    return this;
  }

  Paginate() {
    if (this.limit > MAX_LIMIT) this.limit = MAX_LIMIT;

    const skip = (this.page - 1) * this.limit;

    this.baseQuery.skip(skip).limit(this.limit);

    return this;
  }

  BuildQuery() {
    return this.Filter().Sort().SelectFields().Paginate();
  }
}

function parseFilter(filter) {
  filter = JSON.stringify(filter);

  filter = filter.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  filter = JSON.parse(filter);

  return filter;
}

function parseSort(sort) {
  return sort && sort.replace(/,/g, ' ');
}

function parseFields(fields) {
  return parseSort(fields);
}

module.exports = QueryBuilder;
