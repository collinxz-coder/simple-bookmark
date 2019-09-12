import * as types from './mutation-types'
import Storage from "../utils/Storage";
import qs from 'qs';

import axios from 'axios';
import Tools from "../utils/Tools";

const axios_instance = axios.create({
  baseURL: "http://localhost:8888/",
  headers: {
    "content-type": "application/x-www-form-urlencoded"
  }
});

/**
 * 获取用户信息
 * @param commit
 */
export const getUserInfo = ({ commit }) => {
  Storage.compulsoryGet("token").then(res => {
    // 获取 token 成功
    commit(types.GET_USER_INFO, { token: res, is_login: true });
  }).catch(err => {
    // 获取 token 失败
    commit(types.GET_USER_INFO, { token: null, is_login: false });
  });
};

/**
 * 登录
 * @param commit
 * @param payload
 */
export const loginByEmail = ({ commit }, payload) => {
  let url = "?service=App.User.Login";

  axios_instance.post(url, qs.stringify(payload), {

  }).then(res => {
    let data = res.data;
    if (data.ret !== 200) {
      alert(data.msg);
      return;
    }

    let token = data.data.token;
    Storage.set({ "token": token });
    commit(types.GET_USER_INFO, { token: token, is_login: true });
    return;
  }).catch(err => {

  })
};


export const  getBookClass = ({ state, commit }) => {
  let url = "?service=App.BookMark.GetAllBookMarkAndBookClass";

  axios_instance.post(url, qs.stringify({ token: state.user.token })).then(res => {
    let data = res.data;
    if (data.ret != 200) {
      throw data.msg;
    }
    return data.data;
  }).then(res => {
    commit(types.GET_LINEAR_BOOKMARK, res);
    commit(types.GET_BOOKMARK, Tools.listToTree(res));
  })
};

export const addChildClass = ({ state, commit }, payload) => {
  let url = "?service=App.BookClass.AddClass";

  axios_instance.post(url, qs.stringify({ parent_id: payload.parent_id, name: payload.name, token: state.user.token })).then(res => {
    let data = res.data;

    if (data.ret == 200) {
      payload.success();
    } else {
      payload.error(data.msg);
    }
  })
};

// ---
/**
 * 获取所有分类.
 *
 * @param state
 * @param commit
 */
export const getClass = ({ state, commit }) => {
  let url = "?service=App.BookClass.GetAllClass";

  axios_instance.post(url, qs.stringify({ token: state.user.token })).then(res => {
    res = res.data;
    if (res.ret == 200) {
      commit(types.GET_BOOKCLASS, Tools.listToTree(res.data));
    }
  })
};

/**
 * 添加书签.
 *
 * @param state
 * @param commit
 * @param payload
 */
export const addBookMark = ({ state, commit }, payload) => {
  let url = "?service=App.BookMark.AddBookMark";

  axios_instance.post(url, qs.stringify({ class_id: payload.class_id, name: payload.name, url: payload.url, token: state.user.token })).then(res => {
    res = res.data;

    if (res.ret == 200) {
      payload.success();
    } else {
      payload.error(res.msg);
    }
  })
};
