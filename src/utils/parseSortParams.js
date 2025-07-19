function parsedSortByfunc(value) {
  if (typeof value === 'undefined') {
    return '_id';
  }

  const keys = ['_id', 'name', 'contactType'];

  if (keys.includes(value) != true) {
    return '_id';
  }
  return value;
}

function parsedSortOrderfunc(value) {
  if (typeof value === 'undefined') {
    return 'asc';
  }
  if (value != 'asc' && 'desc') {
    return 'asc';
  }
  return value;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parsedSortByfunc(sortBy);
  const parsedSortOrder = parsedSortOrderfunc(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
