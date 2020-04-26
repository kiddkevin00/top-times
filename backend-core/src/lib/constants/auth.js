exports.ERROR_MSG = {
  JWT_INVALID: 'The provided JWT is invalid.',
  EMAIL_ALREADY_SIGNUP: 'This email address has already been taken.',
  LOGIN_INFO_INCORRECT: 'Incorrect login information.',
  USER_NOT_FOUND: 'The provided user is no longer exited in database.',
  TIMEZONE_NOT_FOUND: 'The provided timezone is no longer exited in database.',
  PERMISSION_DENIED: 'You are not authorized to perform this operation.',
};

exports.CORS = {
  WHITELIST: [
    'https://www.toptimes.com',
    'http://0.0.0.0:8088',
    'http://127.0.0.1:8088',
    'http://localhost:8088',
  ],
};

exports.ROLES = {
  MEMBER: 'Member',
  MANAGER: 'Manager',
  ADMIN: 'Admin',
};

exports.SALT_ROUNDS = 5;
