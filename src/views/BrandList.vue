<template>
  <div>
    <BaseG3Table :namespace="namespace" :columns="columns" />
  </div>
</template>

<script>
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
      namespace: 'Brand',
      entity: 'brand',
      // labelField: 'brandName',
      // title: 'Brand List',
      // subTitle:
      //   'Use this to maintain a list of brands, including a unique prefix, used in brand numbers.',
      sort: 'modifiedOn',
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
    // Set store state
    // this.$store.dispatch('Brand/entitySet', this.entity)
    // this.$store.dispatch('Brand/labelFieldSet', this.labelField)
    // this.$store.dispatch('Brand/titleSet', this.title)
    // this.$store.dispatch('Brand/subTitleSet', this.subTitle)
    // Set entity store values specific to Brands
    this.$store.dispatch(
      'Brand/activeFilterButtonsSet',
      this.activeFilterButtons
    )

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
      await this.$store.dispatch('Brand/fetchItems', true)
    },
    fetchData: async function () {
      if (this.force) {
        this.$store.dispatch('Brand/sortSet', {
          currentSort: this.sort,
          currentSortDir: 'desc'
        })
      }
      await this.$store.dispatch('Brand/fetchItems', this.force)
    }
  }
}
</script>

<style scoped>
</style>
