import Vue from 'vue'
import VueToast from 'vue-toast-notification'
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css'
import 'vue-toast-notification/dist/theme-sugar.css'

Vue.use(VueToast)

export const toast = function(msg, type, duration) {
  Vue.$toast.open({
    message: msg,
    type: type,
    duration: duration || 5000
  })
}
