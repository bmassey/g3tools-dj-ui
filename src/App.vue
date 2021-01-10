<template>
  <div id="app">
    <div id="nav">
      <NavBar />
    </div>
    <router-view :key="$route.fullPath" />
    <!-- <router-view /> -->
  </div>
</template>

<script>
//import NavBar from "@/components/NavBar.vue";
import NavBar from '@/components/NavBar.vue'

export default {
  Components: {
    NavBar
  }
}
</script>
