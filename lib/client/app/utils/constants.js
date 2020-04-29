import moment from 'moment-timezone';

const noop = () => {};

const backendVersion = 'v1';
const baseUrl = {
  production: `https://backend-core.toptimes.com/api/${backendVersion}`,
  test: `http://localhost/api/${backendVersion}`,
  development: `http://localhost:8087/api/${backendVersion}`,
};
const baseUrlHost = baseUrl.test.split('/api')[0];

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
  baseUrl,
  baseUrlHost,
  backendVersion,
  errorMessages,
  jwtStorageKey,
  timeZonesSortBy,
  usersSortBy,
  roles,
  allAvailableTimeZones,
};
