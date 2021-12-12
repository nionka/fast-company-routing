import axios from 'axios';
import { toast } from 'react-toastify';
import configFile from '../config.json';

axios.defaults.baseURL = configFile.apiEndPoint;

axios.interceptors.request.use(
  function (config) {
    if (configFile.isFireBase) {
      const containSlash = /\/$/gi.test(config.url);
      config.url = (containSlash ? config.url.slice(0, -1) : config.url) + '.json';
    }

    return config;
  }, function (error) {
    return Promise.reject(error);
  }
);

function transformData (data) {
  return data
    ? Object.keys(data).map(key => ({ ...data[key] }))
    : [];
}

axios.interceptors.response.use(
  res => {
    if (configFile.isFireBase) {
      res.data = { content: transformData(res.data) };
    }
    return res;
  }, function (err) {
    const expectedErrors = err.response && err.response.status >= 400 && err.response.status < 500;

    if (!expectedErrors) {
      console.log(err);
      toast.error('Что-то пошло не так. Попробуйте позже!!!');
    }

    return Promise.reject(err);
  });

const httpService = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
};

export default httpService;
