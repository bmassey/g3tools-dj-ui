import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

Vue.config.productionTip = false

Vue.component("NavBar", require("./components/NavBar.vue").default)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
