exports.ERROR_MSG = {
  JWT_INVALID: 'The provided JWT is invalid.',
  EMAIL_ALREADY_SIGNUP: 'The provided email is already signed up.',
  LOGIN_INFO_INCORRECT: 'The provided login information is incorrect.',
  USER_NOT_FOUND: 'The provided user is no longer exited in database.',
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