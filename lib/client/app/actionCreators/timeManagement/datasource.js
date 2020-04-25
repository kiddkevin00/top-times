import HttpClient from '../../utils/HttpClient';

const httpClient = HttpClient.createInstance();

// eslint-disable-next-line import/prefer-default-export
export const fetchMyTimeZones = () => httpClient.get('/timezones/mine');
