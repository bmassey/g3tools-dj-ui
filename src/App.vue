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
  },
  computed: {
    toastMessage() {
      return this.$store.state['Notification'].toast.message
    },
    toast() {
      return this.$store.state['Notification'].toast
    }
  },
  watch: {
    toastMessage: function () {
      this.toastShow()
    }
  },
  methods: {
    async toastShow() {
      // Toast message from store

      this.$bvToast.toast(this.toastMessage, {
        title: this.toast.title,
        toaster: this.toast.toaster,
        variant: this.toast.variant
      })
      this.$store.dispatch('Notification/toastErrorAdd', '', { root: true })
    }
  }
}
</script>

<style>
.error {
  border: 1px solid red;
}
.errorMessage {
  color: red;
}
</style>