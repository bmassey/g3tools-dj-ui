<template>
  <div>
    <BaseG3Table :namespace="namespace" :columns="columns" />
  </div>
</template>

<script>
// import _ from 'lodash'
import Vue from 'vue'
import VueToast from 'vue-toast-notification'
// Import one of the available themes
import 'vue-toast-notification/dist/theme-default.css'
import 'vue-toast-notification/dist/theme-sugar.css'
import config from '../../config'

Vue.use(VueToast)

export default {
  components: {},
  props: {
    force: { default: false }
  },
  data() {
    return {
      namespace: 'Restricted',
      entity: 'restricted',
      // labelField: 'itemNumber',
      // title: 'Restricted List',
      // subTitle: 'List of items restricted (cannot be sold) on Amazon.',
      sort: 'ts',
      selectedItem: {},
      showItem: false,
      timer: ''
    }
  },
  computed: {
    page() {
      return parseInt(this.$route.query.page) || 1
    },
    state() {
      return this.$store.state[this.namespace]
    },
    columns() {
      return this.state.columns
    }
  },
  async created() {
    await this.fetchData()
    this.timer = setInterval(
      await this.autoRefresh,
      config.autoListRefreshIntervalMin * 60 * 1000
    )
  },
  async mounted() {
    // runs when the element is injected into the browser
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    autoRefresh: async function () {
      await this.$store.dispatch('Restricted/fetchItems', true)
    },
    fetchData: async function () {
      if (this.force) {
        this.$store.dispatch('Restricted/sortSet', {
          currentSort: this.sort,
          currentSortDir: 'desc'
        })
      }
      await this.$store.dispatch('Restricted/fetchItems', this.force)
    }
  }
}
</script>

<style scoped>
</style>
