exports.JWT = {
  SECRET: 'test-jwt-secret',
  ISSUER: 'http://localhost:8087',
  AUDIENCE: 'http://localhost:8088',
  EXPIRES_IN: '365 days',
  NOT_BEFORE: 0,

  COOKIE_NAME: 'jwt',
  COOKIE_HTTP_ONLY: true,
  COOKIE_SECURE: false,
  COOKIE_PATH: '/api',
  COOKIE_MAX_AGE: 365 * 24 * 60 * 60 * 1000,
  COOKIE_SIGNED: false,
};
