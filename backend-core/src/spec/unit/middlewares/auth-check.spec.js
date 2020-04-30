const authCheckMiddleware = require('../../../lib/middlewares/auth-check');
const jwt = require('jsonwebtoken');
const constants = require('../../../lib/constants/');

describe('Auth Check middleware', function () {
  describe('can verify JWT token from a request header', () => {
    let req;
    let res;
    let next;
    let stubFuncs;

    beforeEach(() => {
      req = {
        headers: {
          authorization: 'Authorization: Bearer 123',
        },
      };
      res = {
        status() {},
        send() {},
      };
      next = stub();

      stubFuncs = [];
      stubFuncs.push(stub(res, 'status', () => res));
      stubFuncs.push(stub(res, 'send'));
    });

    afterEach(function () {
      for (const stubFunc of stubFuncs) {
        stubFunc.restore();
      }
    });

    it('should go to the next middle when passing the validation', () => {
      stubFuncs.push(stub(jwt, 'verify', () => ({})));

      authCheckMiddleware(req, res, next);

      expect(next).to.have.been.called;
    });

    it('should not go to the next middle when failing the validation', () => {
      const errMessage = 'Something went wrong during JWT validation';

      stubFuncs.push(stub(jwt, 'verify', () => { throw new Error(errMessage); }));

      authCheckMiddleware(req, res, next);

      expect(next).to.not.have.been.called;
      expect(res.send).to.have.been.calledWith(errMessage);
    });

    it('should not go to the next middle when failing the validation and throw falsy value', () => {
      stubFuncs.push(stub(jwt, 'verify', () => { throw null; }));

      authCheckMiddleware(req, res, next);

      expect(next).to.not.have.been.called;
      expect(res.status).to.have.been.calledWith(constants.SYSTEM.HTTP_STATUS_CODES.UNAUTHENTICATED);
      expect(res.send).to.have.been.calledWith(constants.AUTH.ERROR_MSG.JWT_INVALID);
    });
  });
});
