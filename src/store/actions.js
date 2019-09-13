import * as types from './mutation-types'
import Storage from "../utils/Storage";
import axios from '../utils/Axios';

// ---
/**
 * 获取用户信息
 * @param commit
 */
export const getUserInfo = ({commit}) => {
  Storage.compulsoryGet("token").then(res => {
    // 获取 token 成功
    commit(types.GET_USER_INFO, {token: res, is_login: true});
  }).catch(err => {
    // 获取 token 失败
    commit(types.GET_USER_INFO, {token: null, is_login: false});
  });
};

/**
 * 登录
 * @param commit
 * @param payload
 */
export const loginByEmail = ({commit}, payload) => {
  let url = "?service=App.User.Login";

  axios.post(url, payload).then(res => {
    let data = res.data;
    if (data.ret !== 200) {
      alert(data.msg);
      return;
    }

    let token = data.data.token;
    Storage.set({"token": token});
    commit(types.GET_USER_INFO, {token: token, is_login: true});
  });
};

/**
 * 获取所有书签分类.
 *
 * @param commit
 * @param state
 */
export const getBookClass = ({commit, state}) => {
  let url = "?service=App.BookClass.GetAllClass";

  axios.post(url, {token: state.user.token}).then(res => {
    res = res.data;
    if (res.ret == 200) {
      let map = {};
      res.data.forEach(item => {
        map[item.id] = item;
      });

      commit(types.GET_BOOK_CLASS, map);
    }
  })
};

/**
 * 获取所有书签.
 *
 * @param commit
 * @param state
 */
export const getBookMark = ({commit, state}) => {
  let url = "?service=App.BookMark.GetAllBookMark";

  axios.post(url, {token: state.user.token}).then(res => {
    res = res.data;
    if (res.ret == 200) {
      let map = {};
      res.data.forEach(item => {
        map[item.id] = item;
      });

      commit(types.GET_BOOK_MARK, map);
    }
  })
};

/**
 * 添加分类.
 *
 * @param commit
 * @param state
 * @param payload
 */
export const addBookClass = ({commit, state}, payload) => {
  let url = "?service=App.BookClass.AddClass";

  axios.post(url, {token: state.user.token, parent_id: payload.parent_id, name: payload.name}).then(res => {
    res = res.data;

    if (res.ret == 200) {
      let new_class = {
        id: res.data.id,
        name: payload.name,
        children: [],
        type: 'dir',
        parent_id: payload.parent_id
      };
      commit(types.ADD_BOOKCLASS, new_class);

      payload.success();
    } else {
      payload.error(res.msg);
    }
  })
};

/**
 * 删除分类.
 *
 * @param commit
 * @param state
 * @param payload
 */
export const deleteBookClass = ({commit, state}, payload) => {
  let url = "?service=App.BookClass.DeleteClass";

  axios.post(url, {token: state.user.token, id: payload.id}).then(res => {
    res = res.data;

    if (res.ret == 200) {
      commit(types.DELETE_BOOKCLASS, payload.id);
      payload.success();
    } else {
      payload.error(res.msg);
    }
  })
};

/**
 * 修改分类.
 *
 * @param commit
 * @param state
 * @param payload
 */
export const modifyBookClass = ({commit, state}, payload) => {
  let url = "?service=App.BookClass.ModifyClass";

  console.log(payload);

  axios.post(url, {token: state.user.token, id: payload.id, name: payload.name, parent_id: payload.parent_id}).then(res => {
    res = res.data;

    if (res.ret == 200) {
      commit(types.MODIFY_CLASS, {name: payload.name, id: payload.id});
      payload.success();
    } else {
      payload.error(res.msg);
    }
  })
};
