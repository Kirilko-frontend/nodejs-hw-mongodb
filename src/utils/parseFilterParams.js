function parseContactType(value) {
  if (typeof value === 'undefined') {
    return undefined;
  }

  return String(value);
}

function parseIsFavourite(value) {
  if (typeof value === 'undefined') {
    return undefined;
  }

  if (value === 'true') return true;
  if (value === 'false') return false;

  return undefined;
}

export function parseFilterParams(query) {
  const { contactType, isFavourite } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavoutire = parseIsFavourite(isFavourite);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavoutire,
  };
}
