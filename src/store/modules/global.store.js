//import router from '../../router'

// Initial state
const inititalState = () => ({
  //routerHistory: []
})
// State object
const state = inititalState()

// Getter functions
const getters = {}

// Actions
const actions = {
  reset({ commit }) {
    commit('RESET')
  }
}

// Mutations
const mutations = {
  RESET(state) {
    const newState = state.initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  }
  // SET_ROUTER_HISTORY(state, hx) {
  //   state.routerHistory = hx
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
