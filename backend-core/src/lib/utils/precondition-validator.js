const ValidationError = require('./validation-error');

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class PreconditionValidator {
  static shouldNotBeEmpty(value, fieldName = 'N/A') {
    if (
      Object.is(value, undefined) ||
      Object.is(value, null) ||
      Object.is(value, '') ||
      (typeof value === 'string' && value.trim().length === 0)
    ) {
      throw new ValidationError(`The provided value \`${value}\` for ${fieldName} field should not be empty.`);
    }
    return PreconditionValidator;
  }

  static shouldBeEnumType(value, options) {
    if (options.indexOf(value) < 0) {
      throw new ValidationError(
        `The provided value \`${value}\` should be one of the enumeration: ${options.join(' ,')}.`
      );
    }
    return PreconditionValidator;
  }

  static shouldBeValidDateString(value) {
    if (Number.isNaN(new Date(value).getTime())) {
      throw new ValidationError(`The provided value \`${value}\` should be a valid timestamp.`);
    }
    return PreconditionValidator;
  }

  static shouldBeArrayOrArrayText(input) {
    let array = input;

    if (typeof array === 'string') {
      try {
        array = JSON.parse(array);
      } catch (_err) {
        throw new _err();
      }
    }

    if (!Array.isArray(array)) {
      throw new ValidationError(`The provided value \`${input}\` should be an array or an array text.`);
    }

    for (const element of array) {
      PreconditionValidator.shouldNotBeEmpty(element);
    }

    return PreconditionValidator;
  }

  static shouldBeValidEmail(value) {
    if (!emailRegex.test(value)) {
      throw new ValidationError(`The provided value \`${value}\` should be a valid email.`);
    }

    return PreconditionValidator;
  }

  static shouldNotBeLengthy(value, numberOfChars = 200) {
    if (value.length > numberOfChars) {
      throw new ValidationError(`The provided value \`${value}\` should not be more than ${numberOfChars} characters.`);
    }

    return PreconditionValidator;
  }
}

module.exports = exports = PreconditionValidator;
