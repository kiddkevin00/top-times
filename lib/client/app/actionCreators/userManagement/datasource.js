import HttpClient from '../../utils/HttpClient';

const httpClient = HttpClient.createInstance();

export const fetchUsers = () => httpClient.get('/users');

export const removeUser = id => httpClient.delete('/users', { params: { id } });
