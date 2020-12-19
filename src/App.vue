<template>
  <div id="app">
    <div id="nav">
      <NavBar />
      <RestictedList />
    </div>
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
// import ListTest from '@/components/ListTest.vue'
import RestrictedList from './views/RestrictedList.vue'

export default {
  Components: {
    NavBar,
    RestrictedList
  },
}
