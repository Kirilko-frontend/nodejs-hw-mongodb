function parsedSortByfunc(value) {
  if (value === undefined) {
    return '_id';
  }

  const keys = ['_id', 'name', 'contactType'];

  if (!keys.includes(value)) {
    return '_id';
  }
  return value;
}

function parsedSortOrderfunc(value) {
  if (value === undefined) {
    return 'asc';
  }
  if (value !== 'asc' && value !== 'desc') {
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
