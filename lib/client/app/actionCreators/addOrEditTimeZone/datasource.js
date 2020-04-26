import HttpClient from '../../utils/HttpClient';

const httpClient = HttpClient.createInstance();

export const fetchTimeZoneInfo = (timeZoneId, userId) =>
  httpClient.get('/timezones', { params: { timeZoneId, userId } });

export const addTimeZone = (payload, userId) =>
  httpClient.post('/timezones', payload, { params: { userId } });

export const updateTimeZone = (payload, timeZoneId, userId) =>
  httpClient.patch('/timezones', payload, { params: { timeZoneId, userId } });
