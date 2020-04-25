import HttpClient from '../../utils/HttpClient';

const httpClient = HttpClient.createInstance();

// eslint-disable-next-line import/prefer-default-export
export const login = (identifier, password) =>
  httpClient.post('/auth/login', { identifier, password });
