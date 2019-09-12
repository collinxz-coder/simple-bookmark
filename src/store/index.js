import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      token: null,
      is_login: false,
    },

    book_mark_class: [],
    linear_mark_class: [],
    book_class: []
  },
  getters,
  mutations,
  actions
})
