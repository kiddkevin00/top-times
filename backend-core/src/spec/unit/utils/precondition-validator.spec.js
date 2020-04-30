const PreconditionValidator = require('../../../lib/utils/precondition-validator');

describe('Precondition validator', function() {
  let value;

  it('should be chainable', () => {
    expect(() => {
      PreconditionValidator.shouldNotBeEmpty('abc123')
        .shouldBeEnumType('option1', ['option1'])
        .shouldBeValidDateString(new Date().toISOString())
        .shouldBeArrayOrArrayText([1, 2, 3]);
    }).to.not.throw();
  });

  it('can validate whether a value is empty :: shouldNotBeEmpty()', () => {
    value = '  ';

    expect(() => {
      PreconditionValidator.shouldNotBeEmpty(value);
    }).to.throw();
  });

  context('can validate if a value belongs to one of the provided options :: shouldBeEnumType()', () => {
    it('should pass the validation', () => {
      value = 'option2';

      expect(() => {
        PreconditionValidator.shouldBeEnumType(value, [value]);
      }).to.not.throw();
    });

    it('should fail the validation', () => {
      value = 'option2';

      expect(() => {
        PreconditionValidator.shouldBeEnumType(value, []);
      }).to.throw();
    });
  });

  context('can validate if a value is a valid time :: shouldBeValidDateString()', () => {
    it('should pass the validation', () => {
      value = new Date().toISOString();

      expect(() => {
        PreconditionValidator.shouldBeValidDateString(value);
      }).to.not.throw();
    });

    it('should fail the validation', () => {
      value = 'an invalid date';

      expect(() => {
        PreconditionValidator.shouldBeValidDateString(value);
      }).to.throw();
    });
  });

  context('can validate if a value is an array :: shouldBeArrayOrArrayText()', () => {
    it('should pass the validation for array', () => {
      value = [4, 5, 6];

      expect(() => {
        PreconditionValidator.shouldBeArrayOrArrayText(value);
      }).to.not.throw();
    });

    it('should pass the validation for array text', () => {
      value = JSON.stringify([7, 8, 9]);

      expect(() => {
        PreconditionValidator.shouldBeArrayOrArrayText(value);
      }).to.not.throw();
    });

    it('should fail the validation for non parsable value', () => {
      value = 'something cant parsed';

      expect(() => {
        PreconditionValidator.shouldBeArrayOrArrayText(value);
      }).to.throw();
    });

    it('should fail the validation for non parsable value but not an array after parsing', () => {
      value = '{}';

      expect(() => {
        PreconditionValidator.shouldBeArrayOrArrayText(value);
      }).to.throw();
    });
  });

  context('can validate if a value is a valid email :: shouldBeValidEmail()', () => {
    it('should pass the validation', () => {
      value = 'user@test.com';

      expect(() => {
        PreconditionValidator.shouldBeValidEmail(value, [value]);
      }).to.not.throw();
    });

    it('should fail the validation', () => {
      value = 'a@t.t';

      expect(() => {
        PreconditionValidator.shouldBeValidEmail(value, []);
      }).to.throw();
    });
  });

  context('can validate if a value is not lengthy :: shouldNotBeLengthy()', () => {
    it('should pass the validation', () => {
      value = 'not lengthy texts';

      expect(() => {
        PreconditionValidator.shouldNotBeLengthy(value);
      }).to.not.throw();
    });

    it('should fail the validation', () => {
      value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure';

      expect(() => {
        PreconditionValidator.shouldNotBeLengthy(value, []);
      }).to.throw();
    });
  });
});
