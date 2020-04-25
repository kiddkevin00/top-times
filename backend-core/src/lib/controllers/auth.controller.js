const DatabaseService = require('../services/database.service');
const tryMiddlewareDecorator = require('../utils/try-middleware-decorator');
const Validator = require('../utils/precondition-validator');
const constants = require('../constants/');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongojs = require('mongojs');

const jwtSecret = constants.CREDENTIAL.JWT.SECRET;
const jwtIssuer = constants.CREDENTIAL.JWT.ISSUER;
const jwtExpiresIn = constants.CREDENTIAL.JWT.EXPIRES_IN;
const jwtNotBefore = constants.CREDENTIAL.JWT.NOT_BEFORE;

const signup = async (req, res) => {
  const fullName = req.body.fullName && req.body.fullName.trim();
  const { timeZone, role, dob, termsAccepted, newsletterSubscribed } = req.body;
  const password = req.body.password && req.body.password.trim();
  const email = req.body.email && req.body.email.trim().toLowerCase();

  Validator.shouldNotBeEmpty(fullName, 'fullName');
  Validator.shouldNotBeEmpty(timeZone, 'timeZone');
  Validator.shouldNotBeEmpty(role, 'role');
  Validator.shouldNotBeEmpty(dob, 'dob');
  Validator.shouldNotBeEmpty(termsAccepted, 'termsAccepted');
  Validator.shouldNotBeEmpty(newsletterSubscribed, 'newsletterSubscribed');
  Validator.shouldNotBeEmpty(password, 'password');
  Validator.shouldNotBeEmpty(email, 'email');
  Validator.shouldBeValidEmail(email);

  const signupCheckStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.SELECT,
      data: [{ $or: [{ email }] }],
    },
    tableName: constants.STORE.TABLE_NAMES.USER,
  };

  const results = await DatabaseService.execute(signupCheckStrategy);

  if (results.length !== 0) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.BAD_REQUEST)
      .send(constants.AUTH.ERROR_MSG.EMAIL_ALREADY_SIGNUP);
  }

  const passwordHash = await bcrypt.hash(password, constants.AUTH.SALT_ROUNDS);
  const signupStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.INSERT,
      data: [
        {
          email,
          fullName,
          timeZone,
          role,
          dob,
          passwordHash,
          termsAccepted,
          newsletterSubscribed,
          isSuspended: false,
          dateCreated: new Date(),
          dateLastModified: null,
        },
      ],
    },
    tableName: constants.STORE.TABLE_NAMES.USER,
  };

  const result = await DatabaseService.execute(signupStrategy);

  const user = Object.assign({}, result);

  delete user.passwordHash;
  delete user.isSuspended;

  const jwtPayload = Object.assign({}, user, { sub: `${user.email}:${user._id}` });
  const jwtToken = jwt.sign(jwtPayload, jwtSecret, {
    issuer: jwtIssuer,
    audience: req.get('origin'),
    expiresIn: jwtExpiresIn,
    notBefore: jwtNotBefore,
  });

  res.cookie(constants.CREDENTIAL.JWT.COOKIE_NAME, jwtToken, {
    httpOnly: constants.CREDENTIAL.JWT.COOKIE_HTTP_ONLY,
    secure: constants.CREDENTIAL.JWT.COOKIE_SECURE,
    path: constants.CREDENTIAL.JWT.COOKIE_PATH,
    maxAge: constants.CREDENTIAL.JWT.COOKIE_MAX_AGE,
    signed: constants.CREDENTIAL.JWT.COOKIE_SIGNED,
  });

  return res.status(constants.SYSTEM.HTTP_STATUS_CODES.CREATED).json({ user, jwtToken });
};

const login = async (req, res) => {
  const identifier = req.body.identifier && req.body.identifier.trim().toLowerCase();
  const plainTextPasswordFromUser = req.body.password && req.body.password.trim();

  Validator.shouldNotBeEmpty(identifier, 'identifier');
  Validator.shouldNotBeEmpty(plainTextPasswordFromUser, 'password');

  const loginStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.SELECT,
      data: [
        {
          email: identifier,
          isSuspended: false,
        },
      ],
    },
    tableName: constants.STORE.TABLE_NAMES.USER,
  };

  const result = await DatabaseService.execute(loginStrategy);

  if (result.length !== 1) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.UNAUTHENTICATED)
      .send(constants.AUTH.ERROR_MSG.LOGIN_INFO_INCORRECT);
  }

  const { passwordHash: passwordHashFromDb } = result[0];

  if (!(await bcrypt.compare(plainTextPasswordFromUser, passwordHashFromDb))) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.UNAUTHENTICATED)
      .send(constants.AUTH.ERROR_MSG.LOGIN_INFO_INCORRECT);
  }

  const user = Object.assign({}, result[0]);

  delete user.passwordHash;
  delete user.isSuspended;

  const jwtPayload = Object.assign({}, user, { sub: `${user.email}:${user._id}` });
  const jwtToken = jwt.sign(jwtPayload, jwtSecret, {
    issuer: jwtIssuer,
    audience: req.get('origin'),
    expiresIn: jwtExpiresIn,
    notBefore: jwtNotBefore,
  });

  res.cookie(constants.CREDENTIAL.JWT.COOKIE_NAME, jwtToken, {
    httpOnly: constants.CREDENTIAL.JWT.COOKIE_HTTP_ONLY,
    secure: constants.CREDENTIAL.JWT.COOKIE_SECURE,
    path: constants.CREDENTIAL.JWT.COOKIE_PATH,
    maxAge: constants.CREDENTIAL.JWT.COOKIE_MAX_AGE,
    signed: constants.CREDENTIAL.JWT.COOKIE_SIGNED,
  });

  return res.status(constants.SYSTEM.HTTP_STATUS_CODES.OK).json({ user, jwtToken });
};

const logout = (req, res) => {
  res.clearCookie(constants.CREDENTIAL.JWT.COOKIE_NAME, {
    path: constants.CREDENTIAL.JWT.COOKIE_PATH,
  });

  return res.sendStatus(constants.SYSTEM.HTTP_STATUS_CODES.NO_CONTENT);
};

const getMyProfile = async (req, res) => {
  const { _id } = req.user;

  const getUserInfoStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.SELECT,
      data: [{ _id: mongojs.ObjectId(_id) }],
    },
    tableName: constants.STORE.TABLE_NAMES.USER,
  };

  const results = await DatabaseService.execute(getUserInfoStrategy);

  if (results.length !== 1) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.UNAUTHENTICATED)
      .send(constants.AUTH.ERROR_MSG.USER_NOT_FOUND);
  }

  const user = Object.assign({}, results[0]);

  delete user.passwordHash;
  delete user.isSuspended;

  const jwtPayload = Object.assign({}, user, { sub: `${user.email}:${user._id}` });
  const jwtToken = jwt.sign(jwtPayload, jwtSecret, {
    issuer: jwtIssuer,
    audience: req.get('origin'),
    expiresIn: jwtExpiresIn,
    notBefore: jwtNotBefore,
  });

  res.cookie(constants.CREDENTIAL.JWT.COOKIE_NAME, jwtToken, {
    httpOnly: constants.CREDENTIAL.JWT.COOKIE_HTTP_ONLY,
    secure: constants.CREDENTIAL.JWT.COOKIE_SECURE,
    path: constants.CREDENTIAL.JWT.COOKIE_PATH,
    maxAge: constants.CREDENTIAL.JWT.COOKIE_MAX_AGE,
    signed: constants.CREDENTIAL.JWT.COOKIE_SIGNED,
  });

  return res.status(constants.SYSTEM.HTTP_STATUS_CODES.OK).json({ user, jwtToken });
};

module.exports = exports = {
  signup: tryMiddlewareDecorator(signup),
  login: tryMiddlewareDecorator(login),
  logout,
  getMyProfile: tryMiddlewareDecorator(getMyProfile),
};
