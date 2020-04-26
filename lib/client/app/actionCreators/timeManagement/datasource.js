import HttpClient from '../../utils/HttpClient';

const httpClient = HttpClient.createInstance();

export const fetchTimeZones = userId => httpClient.get('/timezones', { params: { userId } });

export const removeTimeZone = (timeZoneId, userId) =>
  httpClient.delete('/timezones', { params: { timeZoneId, userId } });
