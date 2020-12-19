import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import RestrictedList from "../views/RestrictedList.vue"
import BrandsList from "@/views/BrandsList.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/restricted-list",
    name: "restricted-list",
    component: RestrictedList,
  },
  {
    path: "/brands-list",
    name: "brands-list",
    component: BrandsList,
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
