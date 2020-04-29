import { checkAuthentication, logout } from '../../../../lib/client/app/actionCreators/me/datasource';
import { baseUrlHost, backendVersion } from '../../../../lib/client/app/utils/constants';
import nock from 'nock';

describe('Data source for Me action creator', () => {
  describe('for HTTP requests related to check authentication', () => {
    let scope;

    beforeAll(() => {
      nock.disableNetConnect();
    });

    afterAll(() => {
      nock.enableNetConnect();
    });

    beforeEach(() => {
      scope = nock(baseUrlHost);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('should have correct check authentication response on success', async () => {
      const user = { fullName: 'John Doe'};
      const jwtToken = 'a-jwt-token';

      scope
        .get(`/api/${backendVersion}/auth/check`)
        .once()
        .reply(200, { user, jwtToken });

      await expect(checkAuthentication()).resolves.toMatchObject({
        status: 200,
        data: { user, jwtToken },
      });
    });

    it('should throw the correct check authentication error on failure', async () => {
      const errorMsg = 'The provided JWT is invalid.';

      scope
        .get(`/api/${backendVersion}/auth/check`)
        .once()
        .reply(401, errorMsg);

      await expect(checkAuthentication()).rejects.toMatchObject({
        message: errorMsg,
      });
    });
  });

  describe('for HTTP requests related to logout', () => {
    let scope;

    beforeAll(() => {
      nock.disableNetConnect();
    });

    afterAll(() => {
      nock.enableNetConnect();
    });

    beforeEach(() => {
      scope = nock(baseUrlHost);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it('should return the correct logout response on success', async () => {
      scope
        .get(`/api/${backendVersion}/auth/logout`)
        .once()
        .reply(204);

      await expect(logout()).resolves.toMatchObject({
        status: 204,
      });
    });

    it('should throw the correct logout error on failure', async () => {
      const errorMsg = 'Here is some test error message.';

      scope
        .get(`/api/${backendVersion}/auth/logout`)
        .once()
        .reply(500, errorMsg);

      await expect(logout()).rejects.toMatchObject({
        message: errorMsg,
      });
    });
  });
});
