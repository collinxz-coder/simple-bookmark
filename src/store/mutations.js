import * as types from './mutation-types'

export default {

  /**
   * 更新 user state.
   *
   * @param state
   * @param payload
   */
  [types.GET_USER_INFO] (state, payload) {
    state.user = payload;
  },

  /**
   * 获取书签分类.
   *
   * @param state
   * @param payload
   */
  [types.GET_BOOK_CLASS] (state, payload) {
    state.book_class = payload;
    state.override_initial += 1;
  },

  /**
   * 获取书签.
   *
   * @param state
   * @param payload
   */
  [types.GET_BOOK_MARK] (state, payload) {
    state.book_mark = payload;
    state.override_initial += 1;
  },

  /**
   * 添加书签.
   *
   * @param state
   * @param payload
   */
  [types.ADD_BOOKCLASS] (state, payload) {
    state.book_class[payload.id] = payload;
    state.override_initial += 1;
  },

  /**
   * 删除书签.
   *
   * @param state
   * @param payload
   */
  [types.DELETE_BOOKCLASS] (state, payload) {
    delete state.book_class[payload];
    state.override_initial += 1;
  },

  /**
   * 修改书签.
   *
   * @param state
   * @param payload
   */
  [types.MODIFY_CLASS] (state, payload) {
    state.book_class[payload.id].name = payload.name;
    state.override_initial += 1;
  },

  [types.DELETE_BOOKMARK] (state, payload) {
    delete state.book_mark[payload.id];
    state.override_initial += 1;
  }
}
