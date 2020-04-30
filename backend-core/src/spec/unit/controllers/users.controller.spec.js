const UsersController = require('../../../lib/controllers/users.controller');
const DatabaseSvc = require('../../../lib/services/database.service');

describe('Users controller', function () {
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

  context('can handle request to get user profile(s) :: getUserProfile()', function () {
    it('on success for all user profiles', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([{}])));

      req.query.id = '1ea60c4c0fa9f0fa43305adf';
      await UsersController.getUserProfile(req, res);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on success for only one my user profile', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([{}])));

      req.user.role = 'Manager';

      await UsersController.getUserProfile(req, res);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on failure', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.reject()));

      await UsersController.getUserProfile(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.have.been.called;
    });
  });

  context('can handle request to update an user profile :: updateUserProfile()', function () {
    it('on success', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([])));

      req.body = {
        fullName: 'Jo Joe',
        timeZone: 'Eastern Standard Time (EST)',
        role: 'manager',
        dob: '1999-10-11',
        newsletterSubscribed: true,
        email: 'jojoe@test.com',
        password: 'P@ssw0rd123',
      };

      await UsersController.updateUserProfile(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on success for my record', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([])));

      delete req.user._id;
      req.user.role = 'Manager';
      req.body = {
        fullName: 'Jo Joe',
        timeZone: 'Eastern Standard Time (EST)',
        role: 'manager',
        dob: '1999-10-11',
        newsletterSubscribed: true,
        email: 'jojoe@test.com',
        password: 'P@ssw0rd123',
      };

      await UsersController.updateUserProfile(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on failure', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.reject()));

      req.body = {
        fullName: 'Jo Joe',
        timeZone: 'Eastern Standard Time (EST)',
        role: 'manager',
        dob: '1999-10-11',
        newsletterSubscribed: true,
        email: 'jojoe@test.com',
        password: 'P@ssw0rd123',
      };

      await UsersController.updateUserProfile(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.have.been.called;
    });
  });

  context('can handle request to suspend an user :: suspendUser()', function () {
    it('on success', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([])));

      req.user.role = 'Manager';

      await UsersController.suspendUser(req, res, next);

      expect(next).to.not.have.been.called;
    });

    it('on failure', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.reject()));

      await UsersController.suspendUser(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.have.been.called;
    });
  });
});
