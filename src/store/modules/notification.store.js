//import router from '../../router'

// Initial state
const inititalState = () => ({
  toast: {
    message: '',
    variant: 'success',
    duration: 5000,
    title: 'Success',
    toaster: 'b-toaster-bottom-right',
    solid: true
  },
  alert: {
    show: false,
    message: 'test test test',
    variant: 'success',
    dismissable: true
  }
})
// State object
const state = inititalState()

// Getter functions
const getters = {}

// Actions
const actions = {
  alertClose({ commit }) {
    commit('ALERT_CLOSE')
  },
  alertErrorAdd({ commit }, message) {
    const alert = {
      show: true,
      message: message,
      variant: 'danger'
    }
    commit('ALERT_ADD', alert)
  },
  alertShowSet({ commit }, value) {
    commit('ALERT_SHOW_SET', value)
  },
  reset({ commit }) {
    commit('RESET')
  },
  toastMsgAdd({ state, commit }, message) {
    const toast = {
      message: message,
      variant: 'success',
      duration: state.toast.duration,
      title: 'Success',
      toaster: state.toast.toaster
    }
    commit('TOAST_MESSAGE_ADD', toast)
  },
  toastErrorAdd({ state, commit }, { message, title }) {
    const toast = {
      message: message,
      variant: 'danger',
      duration: state.toast.duration,
      title: title,
      toaster: state.toast.toaster
    }
    commit('TOAST_MESSAGE_ADD', toast)
  }
}

// Mutations
const mutations = {
  ALERT_ADD(state, payload) {
    state.alert = Object.assign({}, payload)
  },
  ALERT_CLOSE(state) {
    state.alert.show = false
  },
  ALERT_SHOW_SET(state, value) {
    state.alert.show = value
  },
  RESET(state) {
    const newState = state.initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  },
  TOAST_MESSAGE_ADD(state, payload) {
    // var oldItem = state.toast
    // Object.assign(oldItem, payload)
    // state.toast = payload
    state.toast = Object.assign({}, payload)
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
