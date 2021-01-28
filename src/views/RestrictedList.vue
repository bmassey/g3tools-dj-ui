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
      timer: '',
      columns: [
        {
          dbName: 'itemNumber',
          headingName: 'Item Number',
          sortable: true,
          headingWidthPct: 21,
          dataWidthPct: 24,
          columnType: 'link'
        },
        {
          dbName: 'brandName',
          headingName: 'Brand Name',
          sortable: true,
          headingWidthPct: 18,
          dataWidthPct: 18,
          columnType: 'text'
        },
        // {
        //   dbName: 'productDescription',
        //   headingName: 'Description',
        //   sortable: true,
        //   headingWidthPct: 22.5,
        //   dataWidthPct: 22,
        //   columnType: 'text'
        // },
        {
          dbName: 'restrictedReason',
          headingName: 'Reason',
          sortable: true,
          headingWidthPct: 20,
          dataWidthPct: 20,
          columnType: 'text'
        },
        {
          dbName: 'enabled',
          headingName: 'Active',
          sortable: true,
          headingWidthPct: 10,
          dataWidthPct: 10,
          columnType: 'checkbox'
        },
        {
          dbName: 'ts',
          headingName: 'Last Modified',
          sortable: true,
          headingWidthPct: -1, // Omit heading width style
          dataWidthPct: 20,
          columnType: 'datetime'
        }
      ],
      activeFilterButtons: [
        {
          btnName: 'enabled',
          btnLabel: 'Active',
          value: 'active'
        },
        {
          btnName: 'disabled',
          btnLabel: 'Inactive',
          value: 'inactive'
        },
        {
          btnName: 'all',
          btnLabel: 'All',
          value: 'all'
        }
      ]
    }
  },
  computed: {
    page() {
      return parseInt(this.$route.query.page) || 1
    },
    state() {
      return this.$store.state[this.namespace]
    }
  },
  async created() {
    // Set store state
    //this.$store.dispatch('Restricted/entitySet', this.entity)
    // this.$store.dispatch('Restricted/labelFieldSet', this.labelField)
    // this.$store.dispatch('Restricted/titleSet', this.title)
    // this.$store.dispatch('Restricted/subTitleSet', this.subTitle)
    // Set entity store values specific to Brands
    this.$store.dispatch(
      'Restricted/activeFilterButtonsSet',
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
