<template>
  <div id="app">
    <div id="nav">
      <NavBar />
        <!-- <Home />
        <RestictedList />
        <BrandsList />
      </NavBar> -->
    </div>
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
// import ListTest from '@/components/ListTest.vue'
// import RestrictedList from './views/RestrictedList.vue'
// import BrandsList from '@/components/BrandsList.vue';
// import Home from '@/components/Home.vue';

export default {
  Components: {
    NavBar,
    // RestrictedList,
    // BrandsList,
    // Home
  },
}
