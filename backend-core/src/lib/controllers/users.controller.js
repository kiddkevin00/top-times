const DatabaseService = require('../services/database.service');
const tryMiddlewareDecorator = require('../utils/try-middleware-decorator');
const Validator = require('../utils/precondition-validator');
const constants = require('../constants/');
const bcrypt = require('bcrypt');
const mongojs = require('mongojs');

const getUserProfile = async (req, res) => {
  const { id: userId } = req.query;
  const { role: myRole } = req.user;

  if (myRole !== constants.AUTH.ROLES.ADMIN && myRole !== constants.AUTH.ROLES.MANAGER) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.FORBIDDEN)
      .send(constants.AUTH.ERROR_MSG.PERMISSION_DENIED);
  }

  const getUserInfoStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.SELECT,
      data: [{ isSuspended: false }],
    },
    tableName: constants.STORE.TABLE_NAMES.USER,
  };

  if (userId) {
    getUserInfoStrategy.operation.data = [{ _id: mongojs.ObjectId(userId) }];
  }

  const results = await DatabaseService.execute(getUserInfoStrategy);

  if (userId && results.length !== 1) {
    return res.status(constants.SYSTEM.HTTP_STATUS_CODES.NOT_FOUND).send(constants.AUTH.ERROR_MSG.USER_NOT_FOUND);
  }

  return res.status(constants.SYSTEM.HTTP_STATUS_CODES.OK).json(results);
};

const updateUserProfile = async (req, res) => {
  const { id: userId } = req.query;
  const { _id: myUserId, role: myRole } = req.user;

  if (userId && (myRole !== constants.AUTH.ROLES.ADMIN && myRole !== constants.AUTH.ROLES.MANAGER)) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.FORBIDDEN)
      .send(constants.AUTH.ERROR_MSG.PERMISSION_DENIED);
  }

  const fullName = req.body.fullName && req.body.fullName.trim();
  const { timeZone, role, dob, newsletterSubscribed } = req.body;
  const password = req.body.password && req.body.password.trim();
  const email = req.body.email && req.body.email.trim().toLowerCase();

  Validator.shouldNotBeEmpty(fullName, 'fullName');
  Validator.shouldNotBeEmpty(timeZone, 'timeZone');
  Validator.shouldNotBeEmpty(role, 'role');
  Validator.shouldNotBeEmpty(dob, 'dob');
  Validator.shouldNotBeEmpty(newsletterSubscribed, 'newsletterSubscribed');
  Validator.shouldNotBeEmpty(email, 'email');
  Validator.shouldBeValidEmail(email);

  const updatedFields = {
    email,
    fullName,
    timeZone,
    role,
    dob,
    newsletterSubscribed,
    dateLastModified: new Date(),
  };

  if (password) {
    updatedFields.passwordHash = await bcrypt.hash(password, constants.AUTH.SALT_ROUNDS);
  }

  const updateProfileStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.UPDATE,
      data: [{ _id: mongojs.ObjectId(userId || myUserId), isSuspended: false }, updatedFields],
    },
    tableName: constants.STORE.TABLE_NAMES.USER,
  };

  const result = await DatabaseService.execute(updateProfileStrategy);

  if (result.nModified === 1) {
    return res.status(constants.SYSTEM.HTTP_STATUS_CODES.OK).json({ user: updatedFields });
  }
  return res.status(constants.SYSTEM.HTTP_STATUS_CODES.NOT_FOUND).send(constants.AUTH.ERROR_MSG.USER_NOT_FOUND);
};

const suspendUser = async (req, res) => {
  const { id: userId } = req.query;
  const { role: myRole } = req.user;

  if (myRole !== constants.AUTH.ROLES.ADMIN && myRole !== constants.AUTH.ROLES.MANAGER) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.FORBIDDEN)
      .send(constants.AUTH.ERROR_MSG.PERMISSION_DENIED);
  }

  const removeUserStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.UPDATE,
      data: [{ _id: mongojs.ObjectId(userId) }, { isSuspended: true }],
    },
    tableName: constants.STORE.TABLE_NAMES.USER,
  };

  const result = await DatabaseService.execute(removeUserStrategy);

  return res.status(constants.SYSTEM.HTTP_STATUS_CODES.OK).json(result);
};

module.exports = exports = {
  getUserProfile: tryMiddlewareDecorator(getUserProfile),
  updateUserProfile: tryMiddlewareDecorator(updateUserProfile),
  suspendUser: tryMiddlewareDecorator(suspendUser),
};
