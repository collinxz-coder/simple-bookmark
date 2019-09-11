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

  [types.GET_BOOKMARK] (state, payload) {
    state.book_mark_class = payload;
  }
}
