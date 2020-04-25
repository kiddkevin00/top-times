import HttpClient from '../../utils/HttpClient';

const httpClient = HttpClient.createInstance();

export const checkAuthentication = () => httpClient.get('/auth/check');

export const logout = () => httpClient.get('/auth/logout');
