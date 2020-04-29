import {
  generateUniqueId,
  redirectTo,
  parseQueryString,
} from '../../../lib/client/app/utils/helpers';
import uuid from 'uuid';

describe('Utility helper class', () => {
  it('should generate a unique id :: generateUniqueId()', () => {
    const { v4 } = uuid;

    uuid.v4 = jest.fn();

    generateUniqueId();

    expect(uuid.v4.mock.calls.length).toBe(1);

    uuid.v4 = v4;
  });

  it('should set the location :: redirectTo()', () => {
    const assign = jest.fn();

    window.location.assign = assign;

    redirectTo('http://foo.com/bar');

    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith('http://foo.com/bar');
  });

  describe('#parseQuerystring()', () => {
    [
      {
        queryStr: undefined,
        expectedParams: {},
        description: 'should return an empty object if there is no search string',
      },
      {
        queryStr: '',
        expectedParams: {},
        description: 'should return an empty object if search is an empty string',
      },
      {
        queryStr: '?king=true&number=123',
        expectedParams: { king: 'true', number: '123' },
        description: 'should return a key-value pairs object of the query string parameters',
      },
      {
        queryStr: '?king',
        expectedParams: { king: null },
        description:
          'should return a key-value pair object of the query string parameter without value',
      },
      {
        queryStr: '?king=',
        expectedParams: { king: '' },
        description:
          'should return a key-value pair object of the query string parameter with empty value',
      },
    ].forEach(({ queryStr, expectedParams, description }) => {
      it(description, () => {
        const params = parseQueryString(queryStr);

        expect(params).toMatchObject(expectedParams);
      });
    });
  });
});
