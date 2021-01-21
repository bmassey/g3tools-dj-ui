import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
//import brand from '@/store/modules/brand'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  modules,
  actions: {
    reset({ commit }) {
      // Resets state of all the modules
      Object.keys(modules).forEach(moduleName => {
        commit(`${moduleName}/RESET`)
      })
    }
  },
  strict: debug,
  state: {},
  mutations: {}
})
