import moment from 'moment-timezone';

const noop = () => {};

const errorMessages = {
  unauthenticated: 'unauthenticated',
};

const jwtStorageKey = 'jwt';

const timeZonesSortBy = {
  name: 'Sort By Name',
  city: 'Sort By City',
  differenceWithGmt: 'Sort By Difference with GMT',
};

const usersSortBy = {
  name: 'Sort By Name',
  role: 'Sort By Role',
  timeZone: 'Sort By Timezone',
};

const roles = {
  member: 'Member',
  manager: 'Manager',
  admin: 'Admin',
};

const allAvailableTimeZones = moment.tz.names().map(timeZone => timeZone.replace(/_/g, ' '));

export {
  noop,
  errorMessages,
  jwtStorageKey,
  timeZonesSortBy,
  usersSortBy,
  roles,
  allAvailableTimeZones,
};
