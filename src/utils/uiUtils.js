import Vue from 'vue'
import VueToast from 'vue-toast-notification'
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css'
import 'vue-toast-notification/dist/theme-sugar.css'

Vue.use(VueToast)

export const toast = function(that, title, msg, type, duration) {
  // Vue.$toast.open({
  //   message: msg,
  //   type: type,
  //   duration: duration || 5000
  // })
  that.$bvToast.toast(msg, {
    title: title,
    variant: type,
    autoHideDelay: duration || 5000
  })
}
