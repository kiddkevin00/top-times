import HttpClient from '../../utils/HttpClient';

const httpClient = HttpClient.createInstance();

export const fetchUserProfile = id => httpClient.get('/users', { params: { id } });

export const updateUserProfile = (payload, id) =>
  httpClient.patch('/users', payload, { params: { id } });
