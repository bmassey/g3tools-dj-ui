import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import { BootstrapVue, BootstrapVueIcons, BVToastPlugin } from 'bootstrap-vue'
import Vuelidate from 'vuelidate'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(BVToastPlugin)
Vue.use(Vuelidate)

// Globally register all base components
const requireComponent = require.context(
  './components',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})

Vue.config.productionTip = false

Vue.component('NavBar', require('./components/NavBar.vue').default)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// Directives
Vue.directive('uppercase', {
  update(el) {
    const sourceValue = el.value
    const newValue = sourceValue.toUpperCase()

    if (sourceValue !== newValue) {
      el.value = newValue
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }
})
