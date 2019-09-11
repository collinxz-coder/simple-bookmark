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
  }
}
