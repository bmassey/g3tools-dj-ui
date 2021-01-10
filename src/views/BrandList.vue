<template>
  <div>
    <BaseG3Table :namespace="namespace" :columns="columns" />
  </div>
</template>

<script>
import BrandService from '../services/BrandService'
// import _ from 'lodash'
import Vue from 'vue'
import VueToast from 'vue-toast-notification'
// Import one of the available themes
import 'vue-toast-notification/dist/theme-default.css'
import 'vue-toast-notification/dist/theme-sugar.css'

Vue.use(VueToast)

export default {
  components: {},
  props: [],
  data() {
    return {
      namespace: 'Brand',
      force: { type: Boolean, default: false },
      sort: 'modifiedOn',
      selectedItem: {},
      showItem: false,
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
  created() {
    this.fetchData()
  },
  async mounted() {
    // runs when the element is injected into the browser
  },
  methods: {
    fetchData: function () {
      if (this.force) {
        this.$store.dispatch('Brand/sortSet', {
          currentSort: this.sort,
          currentSortDir: 'desc'
        })
      }
      this.$store.dispatch('Brand/fetchItems', this.force)
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
          this.$store.dispatch('brand/dataLoadingSet', true)
          await BrandService.createBrand(detailItem)
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
          await BrandService.saveBrand(detailItem)
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
        this.$store.dispatch('brand/dataLoadingSet', false)
      }
    }
  }
}
</script>

<style scoped>
</style>
