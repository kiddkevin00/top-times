const errorHandler = require('../../../lib/middlewares/error-handler');
const ValidationError = require('../../../lib/utils/validation-error');
const constants = require('../../../lib/constants/');

describe('Error Handler middleware', function () {
  describe('can verify JWT token from a request header', () => {
    let req;
    let res;
    let stubFuncs;

    beforeEach(() => {
      req = {};
      res = {
        status() {},
        send() {},
      };

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
      const err = new Error('Something went wrong...');

      errorHandler(err, req, res);

      expect(res.status).to.have.been.calledWith(constants.SYSTEM.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
      expect(res.send).to.have.been.calledWith(err.message);
    });

    it('should not go to the next middle when failing the validation', () => {
      const err = new ValidationError('This is a validation error');

      errorHandler(err, req, res);

      expect(res.status).to.have.been.calledWith(constants.SYSTEM.HTTP_STATUS_CODES.BAD_REQUEST);
      expect(res.send).to.have.been.calledWith(err.message);
    });
  });
});
