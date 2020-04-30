const AuthController = require('../../../lib/controllers/auth.controller');
const DatabaseSvc = require('../../../lib/services/database.service');
const bcrypt = require('bcrypt');

describe('Auth controller', function () {
  let req;
  let res;
  let next;
  let stubFuncs;

  beforeEach(function () {
    req = {
      get: stub(),
    };

    res = {
      status: stub().returnsThis,
      json: stub(),
      send: stub(),
      sendStatus: stub(),
      cookie: stub(),
      clearCookie: stub(),
    };

    next = stub();

    stubFuncs = [];
  });

  afterEach(function () {
    for (const stubFunc of stubFuncs) {
      stubFunc.restore();
    }
  });

  context('can handle signup request :: signup()', function () {
    it('on success', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([])));

      req.body = {
        fullName: 'Jon Joe',
        timeZone: 'GMT',
        role: 'Admin',
        dob: '1992-01-02',
        termsAccepted: true,
        newsletterSubscribed: true,
        password: 'P@ssw0rd123',
        email: 'test@user.com',
      };

      await AuthController.signup(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on failure', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.reject()));

      req.body = {
        fullName: 'Jon Joe',
        timeZone: 'GMT',
        role: 'Admin',
        dob: '1992-01-02',
        termsAccepted: true,
        newsletterSubscribed: true,
        password: 'P@ssw0rd123',
        email: 'test@user.com',
      };

      await AuthController.signup(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.have.been.called;
    });
  });

  context('can handle login request :: login()', function () {
    it('on success', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([{}])));

      stub(bcrypt, 'compare', () => true);

      req.body = {
        identifier: 'foo@bar.com',
        password: 'foobar-secret',
      };

      await AuthController.login(req, res,);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on failure', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.reject()));

      req.body = {
        identifier: 'foo@bar.com',
        password: 'foobar-secret',
      };

      await AuthController.login(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.have.been.called;
    });
  });

  context('can handle logout request :: logout()', function () {
    it('on success', async () => {
      await AuthController.logout(req, res, next);

      expect(next).to.not.have.been.called;
    });
  });

  context('can handle request to get my profile :: getMyProfile()', function () {
    it('on success', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.resolve([{}])));

      req.user = {};

      await AuthController.getMyProfile(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.not.have.been.called;
    });

    it('on failure', async () => {
      stubFuncs.push(stub(DatabaseSvc, 'execute', () => Promise.reject()));

      req.user = {};

      await AuthController.getMyProfile(req, res, next);

      expect(DatabaseSvc.execute).to.have.been.calledWith(match.object);
      expect(next).to.have.been.called;
    });
  });
});
