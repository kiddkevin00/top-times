import HttpClient from '../../utils/HttpClient';

const httpClient = HttpClient.createInstance();

// eslint-disable-next-line import/prefer-default-export
export const signUp = payload => httpClient.post('/auth/signup', payload);
