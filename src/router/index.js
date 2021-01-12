import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RestrictedList from '../views/RestrictedList.vue'
import BrandList from '../views/BrandList.vue'
import BrandItem from '@/views/BrandItem.vue'
import ItemMasterList from '../views/ItemMasterList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/home',
    name: 'home1',
    component: Home
  },
  {
    path: '/restricted-list',
    name: 'restricted-list',
    component: RestrictedList
  },
  {
    path: '/brand-list',
    name: 'brand-list',
    component: BrandList,
    props: true
  },
  {
    path: '/brand-item/:id',
    name: 'brand-item',
    component: BrandItem,
    props: true
  },
  {
    path: '/item-master-list',
    name: 'item-master-list',
    component: ItemMasterList
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  hash: false,
  base: process.env.BASE_URL
  // scrollBehavior(to, from, savedPosition) {
  //   const fromHistory = Boolean(savedPosition)
  //   const savedHistory = state.routerHistory || []
  //   if (fromHistory && savedHistory.length > 0) {
  //     state.Global.state.routerHistory.splice(-1, 1)
  //   } else {
  //     state.Global.state.routerHistory.push(from)
  //   }

  //   return savedPosition || { x: 0, y: 0 }
  // }
})

export default router
