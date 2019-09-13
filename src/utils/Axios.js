import axios from 'axios';
import qs from 'qs';

const instance = axios.create({
  baseURL: "http://localhost:8888/",
  headers: {
    "content-type": "application/x-www-form-urlencoded"
  }
});

let post = instance.post;

/**
 * 发送 post 请求
 * @param url
 * @param param
 * @returns {Promise<R>}
 */
instance.post = (url, param) => {
  param = qs.stringify(param);

  return post(url, param);
};

export default instance;
