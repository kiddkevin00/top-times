const noop = () => {};

const errorMessages = {
  unauthenticated: 'unauthenticated',
};

const jwtStorageKey = 'jwt';

const timeZonesSortBy = {
  name: 'Name',
  city: 'City',
  differenceWithGmt: 'Difference with GMT',
};

const usersSortBy = {
  name: 'Name',
  role: 'Role',
  timeZone: 'Time Zone',
};

const roles = {
  member: 'Member',
  manager: 'Manager',
  admin: 'Admin',
};

export {
  noop,
  errorMessages,
  jwtStorageKey,
  timeZonesSortBy,
  usersSortBy,
  roles,
};
