const TimeZonesController = require('../../../lib/controllers/time-zones.controller');
const DatabaseSvc = require('../../../lib/services/database.service');

describe('Time Zones controller', function () {
  let req;
  let res;
  let next;
  let stubFuncs;

  beforeEach(function () {
    req = {
      get: stub(),
      user: {
        _id: '6ea60c4c0fa9f0fa43305adf',
        role: 'Admin',
      },
      query: {
        userId: '5ea60c4c0fa9f0fa43305adf',
      },
    };

    res = {
      status: stub().returnsThis,
      json: stub(),
      send: stub(),
      sendStatus: stub(),
    };

    next = stub();

    stubFuncs = [];
  });

  afterEach(function () {
    for (const stubFunc of stubFuncs) {
      stubFunc.restore();
    }
  });

  context('can handle request to add a time zone :: addTimeZone()', function () {
    it('on success', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([])));

      req.body = {
        displayName: 'A Time Zone',
        cityInTimeZone: 'America/New York',
        customCityName: 'Hello Kitty',
        notes: 'Here are some notes...',
      };

      await TimeZonesController.addTimeZone(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on success for my record', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([])));

      delete req.query.userId;
      req.body = {
        displayName: 'A Time Zone',
        cityInTimeZone: 'America/New York',
        customCityName: 'Hello Kitty',
        notes: 'Here are some notes...',
      };

      await TimeZonesController.addTimeZone(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on failure', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.reject()));

      req.body = {
        displayName: 'A Time Zone',
        cityInTimeZone: 'America/New York',
        customCityName: 'Hello Kitty',
        notes: 'Here are some notes...',
      };

      await TimeZonesController.addTimeZone(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.have.been.called;
    });
  });

  context('can handle request to get time zone(s) :: getTimeZone()', function () {
    it('on success for all time zones', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([{}])));

      await TimeZonesController.getTimeZone(req, res);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on success for only one time zone in my record', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([{}])));

      req.query.timeZoneId = '8ea60c4c0fa9f0fa43305adf';
      delete req.query.userId;

      await TimeZonesController.getTimeZone(req, res);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on failure', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.reject()));

      await TimeZonesController.getTimeZone(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.have.been.called;
    });
  });

  context('can handle request to update a time zone :: updateTimeZone()', function () {
    it('on success', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([])));

      req.query.timeZoneId = '7ea60c4c0fa9f0fa43305adf';
      req.body = {
        displayName: 'Another Time Zone',
        cityInTimeZone: 'Asia/Taipei',
        customCityName: 'Hello Kitty',
        notes: 'Here are some notes...',
      };

      await TimeZonesController.updateTimeZone(req, res, next);

      expect(next).to.not.have.been.called;
    });

    it('on success for my record', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([])));

      delete req.query.userId;
      req.query.timeZoneId = '7ea60c4c0fa9f0fa43305adf';
      req.body = {
        displayName: 'Another Time Zone',
        cityInTimeZone: 'Asia/Taipei',
        customCityName: 'Hello Kitty',
        notes: 'Here are some notes...',
      };

      await TimeZonesController.updateTimeZone(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on failure', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.reject()));

      req.query.timeZoneId = '7ea60c4c0fa9f0fa43305adf';
      req.body = {
        displayName: 'Another Time Zone',
        cityInTimeZone: 'Asia/Taipei',
        customCityName: 'Hello Kitty',
        notes: 'Here are some notes...',
      };

      await TimeZonesController.updateTimeZone(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.have.been.called;
    });
  });

  context('can handle request to remove a time zone :: removeTimeZone()', function () {
    it('on success', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([])));

      req.query.timeZoneId = '7ea60c4c0fa9f0fa43305adf';

      await TimeZonesController.removeTimeZone(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on success for my record', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([])));

      req.query.timeZoneId = '7ea60c4c0fa9f0fa43305adf';

      await TimeZonesController.removeTimeZone(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on failure', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.reject()));

      delete req.query.userId;
      req.query.timeZoneId = '7ea60c4c0fa9f0fa43305adf';

      await TimeZonesController.removeTimeZone(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.have.been.called;
    });
  });
});
