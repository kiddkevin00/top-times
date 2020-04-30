const DatabaseService = require('../services/database.service');
const tryMiddlewareDecorator = require('../utils/try-middleware-decorator');
const Validator = require('../utils/precondition-validator');
const constants = require('../constants/');
const mongojs = require('mongojs');

const addTimeZone = async (req, res) => {
  const { userId } = req.query;
  const { _id: myUserId, role: myRole } = req.user;

  if (userId && myRole !== constants.AUTH.ROLES.ADMIN) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.FORBIDDEN)
      .send(constants.AUTH.ERROR_MSG.PERMISSION_DENIED);
  }

  const displayName = req.body.displayName && req.body.displayName.trim();
  const { cityInTimeZone } = req.body;
  const customCityName = req.body.customCityName && req.body.customCityName.trim();
  const notes = req.body.notes && req.body.notes.trim();

  Validator.shouldNotBeEmpty(displayName, 'displayName');
  Validator.shouldNotBeEmpty(cityInTimeZone, 'cityInTimeZone');

  const updateTimeZoneInfoStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.INSERT,
      data: [
        {
          userId: mongojs.ObjectId(userId || myUserId),
          displayName,
          cityInTimeZone,
          customCityName,
          notes,
          dateCreated: new Date(),
          dateLastModified: null,
        },
      ],
    },
    tableName: constants.STORE.TABLE_NAMES.TIME_ZONE,
  };

  const result = await DatabaseService.execute(updateTimeZoneInfoStrategy);

  return res.status(constants.SYSTEM.HTTP_STATUS_CODES.CREATED).json(result);
};

const getTimeZone = async (req, res) => {
  const { timeZoneId, userId } = req.query;
  const { _id: myUserId, role: myRole } = req.user;

  if (userId && myRole !== constants.AUTH.ROLES.ADMIN) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.FORBIDDEN)
      .send(constants.AUTH.ERROR_MSG.PERMISSION_DENIED);
  }

  const getTimeZoneInfoStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.SELECT,
      data: [{ userId: mongojs.ObjectId(userId || myUserId) }],
    },
    tableName: constants.STORE.TABLE_NAMES.TIME_ZONE,
  };

  if (timeZoneId) {
    getTimeZoneInfoStrategy.operation.data = [
      {
        userId: mongojs.ObjectId(userId || myUserId),
        _id: mongojs.ObjectId(timeZoneId),
      },
    ];
  }

  const results = await DatabaseService.execute(getTimeZoneInfoStrategy);

  if (timeZoneId && results.length !== 1) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.NOT_FOUND)
      .send(constants.AUTH.ERROR_MSG.TIMEZONE_NOT_FOUND);
  }
  return res.status(constants.SYSTEM.HTTP_STATUS_CODES.OK).json(results);
};

const updateTimeZone = async (req, res) => {
  const { timeZoneId, userId } = req.query;
  const { _id: myUserId, role: myRole } = req.user;

  if (userId && myRole !== constants.AUTH.ROLES.ADMIN) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.FORBIDDEN)
      .send(constants.AUTH.ERROR_MSG.PERMISSION_DENIED);
  }

  const displayName = req.body.displayName && req.body.displayName.trim();
  const { cityInTimeZone } = req.body;
  const customCityName = req.body.customCityName && req.body.customCityName.trim();
  const notes = req.body.notes && req.body.notes.trim();

  Validator.shouldNotBeEmpty(timeZoneId, 'timeZoneId');
  Validator.shouldNotBeEmpty(displayName, 'displayName');
  Validator.shouldNotBeEmpty(cityInTimeZone, 'cityInTimeZone');

  const updatedFields = {
    displayName,
    cityInTimeZone,
    customCityName,
    notes,
    dateLastModified: new Date(),
  };

  const updateTimeZoneInfoStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.UPDATE,
      data: [
        { _id: mongojs.ObjectId(timeZoneId), userId: mongojs.ObjectId(userId || myUserId) },
        updatedFields,
      ],
    },
    tableName: constants.STORE.TABLE_NAMES.TIME_ZONE,
  };

  const result = await DatabaseService.execute(updateTimeZoneInfoStrategy);

  if (result.nModified === 1) {
    return res.status(constants.SYSTEM.HTTP_STATUS_CODES.OK).json({ user: updatedFields });
  }
  return res
    .status(constants.SYSTEM.HTTP_STATUS_CODES.NOT_FOUND)
    .send(constants.AUTH.ERROR_MSG.TIMEZONE_NOT_FOUND);
};

const removeTimeZone = async (req, res) => {
  const { timeZoneId, userId } = req.query;
  const { _id: myUserId, role: myRole } = req.user;

  if (userId && myRole !== constants.AUTH.ROLES.ADMIN) {
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.FORBIDDEN)
      .send(constants.AUTH.ERROR_MSG.PERMISSION_DENIED);
  }

  const removeTimeZoneStrategy = {
    storeType: constants.STORE.TYPES.MONGO_DB,
    operation: {
      type: constants.STORE.OPERATIONS.DELETE,
      data: [{ _id: mongojs.ObjectId(timeZoneId), userId: mongojs.ObjectId(userId || myUserId) }],
    },
    tableName: constants.STORE.TABLE_NAMES.TIME_ZONE,
  };

  const result = await DatabaseService.execute(removeTimeZoneStrategy);

  if (result.n === 1) {
    return res.sendStatus(constants.SYSTEM.HTTP_STATUS_CODES.NO_CONTENT);
  }
  return res
    .status(constants.SYSTEM.HTTP_STATUS_CODES.NOT_FOUND)
    .send(constants.AUTH.ERROR_MSG.TIMEZONE_NOT_FOUND);
};

module.exports = exports = {
  addTimeZone: tryMiddlewareDecorator(addTimeZone),
  getTimeZone: tryMiddlewareDecorator(getTimeZone),
  updateTimeZone: tryMiddlewareDecorator(updateTimeZone),
  removeTimeZone: tryMiddlewareDecorator(removeTimeZone),
};
