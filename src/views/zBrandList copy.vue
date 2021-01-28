<template>
  <div>
    <BaseG3Table :namespace="namespace" :columns="columns" />
  </div>
</template>

<script>
import EntityService from '../services/EntityService'
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
      namespace: 'Entity',
      entity: 'brand',
      title: 'Brand List',
      subTitle:
        'Use this to maintain a list of brands, including a unique prefix, used in brand numbers.',
      sort: 'modifiedOn',
      selectedItem: {},
      showItem: false,
      timer: '',
      columns: [
        {
          dbName: 'brandName',
          headingName: 'Brand Name',
          sortable: true,
          headingWidthPct: 24.5,
          dataWidthPct: 25,
          columnType: 'link'
        },
        {
          dbName: 'abbreviation',
          headingName: 'Abbrev',
          sortable: true,
          headingWidthPct: 10,
          dataWidthPct: 10,
          columnType: 'text'
        },
        {
          dbName: 'vendorName',
          headingName: 'Vendor Name',
          sortable: true,
          headingWidthPct: 24.5,
          dataWidthPct: 25,
          columnType: 'text'
        },
        {
          dbName: 'active',
          headingName: 'Active',
          sortable: true,
          headingWidthPct: 10,
          dataWidthPct: 10,
          columnType: 'checkbox'
        },
        {
          dbName: 'modifiedOn',
          headingName: 'Last Modified',
          sortable: true,
          headingWidthPct: -1, // Omit heading width style
          dataWidthPct: 20,
          columnType: 'datetime'
        }
      ],
      activeFilterButtons: [
        {
          btnName: 'active',
          btnLabel: 'Active',
          value: 'active'
        },
        {
          btnName: 'inactive',
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
    this.$store.dispatch('Entity/entitySet', this.entity)
    this.$store.dispatch('Entity/titleSet', this.title)
    this.$store.dispatch('Entity/subTitleSet', this.subTitle)
    // Set entity store values specific to Brands
    this.$store.dispatch(
      'Entity/activeFilterButtonsSet',
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
      await this.$store.dispatch('Entity/fetchItems', true)
    },
    fetchData: async function () {
      if (this.force) {
        this.$store.dispatch('Entity/sortSet', {
          currentSort: this.sort,
          currentSortDir: 'desc'
        })
      }
      await this.$store.dispatch('Entity/fetchItems', this.force)
    },
    addBrand: function () {
      this.$router.push({
        name: 'brand-item',
        params: {
          item: 'new'
        }
      })
    },
    closeItemDetail: async function (detailItem) {
      try {
        this.showItem = false
        if (detailItem === 'cancel') return null
        // If detailItem is found in list, update it
        // Otherwise, add to first of data items array
        if (detailItem.id === '') {
          // Save new item to db and add to data array
          this.$store.dispatch('Entity/dataLoadingSet', true)
          await EntityService.createItem(detailItem)
          // utils.upsertArray(this.data, newItem);
          // Sort by createdOn desc
          this.currentSort = 'modifiedOn'
          this.currentSortDir = 'asc'
          this.sort('modifiedOn')
          // Toast: New item added
          const msg = `Successfully added brand ${detailItem.brandName} to database`
          Vue.$toast.open({
            message: msg,
            type: 'success',
            duration: 5000
          })
        } else {
          // Update existing
          await EntityService.saveItem(detailItem)
          const msg = `Successfully updated brand ${detailItem.brandName} to database`
          Vue.$toast.open({
            message: msg,
            type: 'success',
            duration: 5000
          })
          // utils.upsertArray(this.data, detailItem);
        }
      } catch (err) {
        console.error(`Error closing Item Detail record: `, err)
      } finally {
        this.$store.dispatch('Entity/dataLoadingSet', false)
      }
    }
  }
}
</script>

<style scoped>
</style>
