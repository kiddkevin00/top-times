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

  it('creates an axios instance with given configuration', () => {
    const config = { some: 'configuration' };
    const httpClient = HttpClient.createInstance(config);

    expect(httpClient.defaults).toMatchObject(config);
  });

  it('able to handle failing response with no response body', async () => {
    const config = {};
    const httpClient = HttpClient.createInstance({
      ...config,
      baseURL,
    });

    scope
      .get('/api/v0/some/endpoint')
      .once()
      .reply(500, 'Something went wrong...');

    try {
      await httpClient.get('/some/endpoint');
    } catch (err) {
      expect(err).toMatchObject({
        message: 'Something went wrong...',
        code: 'UNKNOWN_ERROR',
      });
    }
  });
});
