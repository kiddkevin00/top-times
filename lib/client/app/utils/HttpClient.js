import { generateUniqueId } from './helpers';
import { baseUrl, jwtStorageKey } from './constants';
import axios from 'axios';

const supportedErrorCodes = {
  SOME_SUPPORTED_ERROR_CODE: 'SOME_SUPPORTED_ERROR_CODE',
};

const instantiateErrorWithCodeAndMsg = ({ code, message }) => {
  const error = new Error(message);

  error.code = code;

  return error;
};
const getErrorCodeAndMsg = (error = {}) => {
  const errorMsg = error.message || error;

  return {
    code: supportedErrorCodes[error.code] || 'UNKNOWN_ERROR',
    message: typeof errorMsg === 'object' ? window.JSON.stringify(errorMsg, null, 2) : errorMsg,
  };
};
const extractErrorFromResponse = error => error.response && error.response.data;
const getError = error =>
  instantiateErrorWithCodeAndMsg(getErrorCodeAndMsg(extractErrorFromResponse(error)));

class HttpClient {
  static createInstance(instanceConfig) {
    let baseURL;

    switch (process.env.NODE_ENV) {
      case 'production':
        baseURL = baseUrl.production;
        break;
      case 'test':
        baseURL = baseUrl.test;
        break;
      default:
        baseURL = baseUrl.development;
    }
    const axiosInstance = axios.create({
      withCredentials: true,
      baseURL,
      ...instanceConfig,
    });

    axiosInstance.interceptors.request.use(config => {
      const reqHeader = {
        Accept: 'application/json',
        'x-trace-id': generateUniqueId(),
        authorization: window.localStorage.getItem(jwtStorageKey),
      };

      return {
        ...config,
        headers: {
          ...config.headers,
          ...reqHeader,
        },
      };
    }, null);

    axiosInstance.interceptors.response.use(null, error => Promise.reject(getError(error)));

    return axiosInstance;
  }
}

export { HttpClient as default, supportedErrorCodes };
