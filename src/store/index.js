import Vue from 'vue'
import Vuex from 'vuex'

import auth from '../store/modules/auth'
import date from '../store/modules/date'

Vue.use(Vuex)

export default new Vuex.Store({
  // state: {
  // },
  // mutations: {
  // },
  // actions: {
  // },
  modules: {
    auth,
    date,
  }
})
