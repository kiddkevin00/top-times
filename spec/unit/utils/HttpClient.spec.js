import HttpClient from '../../../lib/client/app/utils/HttpClient';
import nock from 'nock';

describe('HTTP Client', () => {
  const baseURL = '/api/v0';
  let scope;

  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  beforeEach(() => {
    scope = nock('http://localhost');
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('creates an axios instance with the given configuration', () => {
    const config = { some: 'configuration' };
    const httpClient = HttpClient.createInstance(config);

    expect(httpClient.defaults).toMatchObject(config);
  });

  it('able to handle failing response with no response body', async () => {
    const errorMsg = 'Something went wrong...';
    const httpClient = HttpClient.createInstance({
      baseURL,
    });

    scope
      .get('/api/v0/some/endpoint')
      .once()
      .reply(500, errorMsg);

    try {
      await httpClient.get('/some/endpoint');
    } catch (err) {
      expect(err).toMatchObject({
        message: errorMsg,
        code: 'UNKNOWN_ERROR',
      });
    }
  });
});
