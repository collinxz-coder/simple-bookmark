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
   * 书签(tree)
   * @param state
   * @param payload
   */
  [types.GET_BOOKMARK] (state, payload) {
    state.book_mark_class = payload;
  },

  /**
   * 书签(linear)
   * @param state
   * @param payload
   */
  [types.GET_LINEAR_BOOKMARK] (state, payload) {
    state.linear_mark_class = payload;
  },

  // ---

  [types.GET_BOOKCLASS] (state, payload) {
    state.book_class = payload;
  }
}
