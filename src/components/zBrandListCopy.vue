<template>
  <div>
    <BaseG3Table :namespace="namespace" />
    <!-- <div v-show="!showItem"> -->
    <!-- <BaseTitle :title="Brand.title" :sub-title="Brand.subTitle" /> -->
    <!-- <div class="border table-action-bar"> -->
    <!-- <div class="d-flex"> -->
    <!-- <BaseSearchBar :namespace="namespace" /> -->
    <!-- Active basic filter -->
    <!-- <BaseButtonGroup :namespace="namespace" /> -->
    <!-- </div> -->
    <!-- Action menu to the right -->
    <!-- <BaseTableAction -->
    <!-- :namespace="namespace" -->
    <!-- @action-add="showItemDetail('new')" -->
    <!-- @action-delete="deleteRows" -->
    <!-- /> -->
    <!-- </div> -->
    <!-- <pulse-loader class="loading" :loading="Brand.dataLoading"></pulse-loader> -->
    <div style="margin-top: 180px">
      <table
        class="table table-hover table-sm table-sortable table-bordered table-striped fixed_header"
        style="width: 100%"
      >
        <thead class="thead-light text-center">
          <tr>
            <th colspan="2" scope="col" style="width: 10%">
              <BaseHeadingSelect
                :selected="Brand.selectedItems.length > 0"
                @heading-select-changed="headingSelectChanged"
                @heading-action="headingAction"
              />
            </th>
            <!-- <th scope="col" style="width: 5%" /> -->
            <th scope="col" style="width: 24.5%" @click="sort('brandName')">
              Brand Name
              <span
                class="fa fa-fw"
                :class="getSortIndicator('brandName')"
              ></span>
            </th>
            <th scope="col" style="width: 10%" @click="sort('abbreviation')">
              Abbrev
              <span
                class="fa fa-fw"
                :class="getSortIndicator('abbreviation')"
              ></span>
            </th>
            <th scope="col" style="width: 24.5%" @click="sort('vendorName')">
              Vendor Name
              <span
                class="fa fa-fw"
                :class="getSortIndicator('vendorName')"
              ></span>
            </th>
            <th scope="col" style="width: 10%" @click="sort('active')">
              Active
              <span class="fa fa-fw" :class="getSortIndicator('active')"></span>
            </th>
            <th scope="col" @click="sort('modifiedOn')">
              Last Modified
              <span
                class="fa fa-fw"
                :class="getSortIndicator('modifiedOn')"
              ></span>
            </th>
          </tr>
        </thead>
        <tbody class="my-tbody">
          <!-- Table data rows -->
          <tr v-for="(item, index) in Brand.brands" :key="item.id">
            <!-- Row select -->
            <td class="p-0 flex-fill" @click="rowSelected(item.id)">
              <i
                class="fa fa-check row-select"
                :class="[
                  isRowChecked(item.id) ? 'row-checked' : 'row-unchecked'
                ]"
              />
            </td>
            <!-- record sequence # -->
            <td
              class="text-right g3-sequence"
              sytle="white-space: nowrap; width: 7%"
            >
              {{ getSequenceNum(index) }}
              <!-- {{ index }} -->
            </td>
            <!-- Brand name -->
            <td
              style="white-space: nowrap; width: 25%"
              @click="showItemDetail(item)"
            >
              <a class="col-link" href="#">{{ item.brandName }}</a>
            </td>
            <!-- Abbreviation -->
            <td style="white-space: nowrap; width: 10%">
              {{ item.abbreviation }}
            </td>
            <!-- Vendor name -->
            <td style="white-space: nowrap; width: 25%">
              {{ item.vendorName }}
            </td>
            <!-- Active -->
            <td style="width: 10%">
              <i class="col-cb" :class="{ 'fa fa-check': item.active }" />
            </td>
            <!-- Modified On -->
            <td style="white-space: nowrap; width: 20%">
              {{ formatDate(item.modifiedOn) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-between">
      <div class="">
        <BaseTotalRows
          :namespace="namespace"
          :selected="Brand.selectedItems.length"
          :no-results-msg="noResultsMsg"
        />
      </div>
      <div class="">
        <BasePagination :namespace="namespace" />
      </div>
    </div>
    <!-- </div> -->
    <!-- Add/update item -->
    <!-- <BrandItem
      v-show="showItem"
      :item="selectedItem"
      :status="itemDetailStatus"
      @item-closed="closeItemDetail"
    /> -->
  </div>
</template>

<script>
import BrandService from '../services/BrandService'
// import _ from 'lodash'
import utils from '../utils/jsUtils.js'
import Vue from 'vue'
import VueToast from 'vue-toast-notification'
// Import one of the available themes
import 'vue-toast-notification/dist/theme-default.css'
import 'vue-toast-notification/dist/theme-sugar.css'
import date from 'date-and-time'
import { mapState, mapGetters } from 'vuex'

Vue.use(VueToast)

export default {
  components: {
    // PulseLoader
  },
  props: [],
  data() {
    return {
      namespace: 'Brand',
      selectedItem: {},
      showItem: false,
      itemDetailStatus: 'new',
      noResultsMsg: '',
      currentRows: 1,
      columns: [
        {
          dbName: 'brandName',
          headingName: 'Brand Name',
          sortable: true,
          headingWidthPct: 24.5,
          dataWidthPct: 25,
          itemDetailLink: true,
          columnType: 'text'
        },
        {
          dbName: 'abbreviation',
          headingName: 'Abbrev',
          sortable: true,
          headingWidthPct: 10,
          dataWidthPct: 10,
          itemDetailLink: false,
          columnType: 'text'
        },
        {
          dbName: 'vendorName',
          headingName: 'Vendor Name',
          sortable: true,
          headingWidthPct: 24.5,
          dataWidthPct: 25,
          itemDetailLink: false,
          columnType: 'text'
        },
        {
          dbName: 'active',
          headingName: 'Active',
          sortable: true,
          headingWidthPct: 10,
          dataWidthPct: 10,
          itemDetailLink: false,
          columnType: 'checkbox'
        },
        {
          dbName: 'modifiedOn',
          headingName: 'Abbrev',
          sortable: true,
          headingWidthPct: -1, // Omit heading width style
          dataWidthPct: 20,
          itemDetailLink: false,
          columnType: 'datetime'
        }
      ]
    }
  },
  computed: {
    page() {
      return parseInt(this.$route.query.page) || 1
    },
    ...mapState(['Brand']),
    ...mapGetters('Brand', ['getSortIndicator'])
  },
  created() {
    this.fetchData()
  },
  async mounted() {
    // runs when the element is injected into the browser
  },
  methods: {
    fetchData: function () {
      this.$store.dispatch('Brand/fetchBrands')
    },
    formatDate: function (rawDate) {
      return date.format(new Date(rawDate), 'MM/DD/YYYY h:mm A')
    },

    rowSelected: function (id) {
      utils.arrToggle(this.Brand.selectedItems, id)
    },
    isRowChecked: function (id) {
      // Is this id in the selectedItems array?
      return this.Brand.selectedItems.indexOf(id) !== -1
    },
    getSequenceNum: function (index) {
      if (this.Brand.pageSize === -1) {
        return index + 1
      } else {
        // Calculate sequence based page
        if (this.page === this.Brand.pageInStore) {
          // Completed fetching records, since page data matches current page #
          return (
            this.Brand.pageSize * this.page - this.Brand.pageSize + index + 1
          )
        } else {
          // Still fetching data, get prev page
          return (
            this.Brand.pageSize * this.Brand.pageInStore -
            this.Brand.pageSize +
            index +
            1
          )
        }
      }
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
          this.$store.dispatch('brand/setLoading', true)
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
        this.$store.dispatch('brand/setLoading', false)
      }
    },
    sort(field) {
      this.$store.dispatch('Brand/sort', field)
    },
    headingSelectChanged() {},
    headingAction() {}
  }
}
</script>

<style scoped>
.table-sortable > thead > tr > th {
  cursor: pointer;
  position: relative;
}
.table-striped > tbody > tr:nth-child(odd) > td,
.table-striped > tbody > tr:nth-child(odd) > th {
  background-color: #fdfcfcc4;
}
.table-hover tbody tr:hover td,
.table-hover tbody tr:hover th {
  background-color: rgba(216, 221, 230, 0.438);
}
.table-bordered {
  /* border-left: 0px; */
  border-top: 0px;
}
.fixed_header > .container {
  padding-left: 0px;
  padding-right: 0px;
}
.fixed_header {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.fixed_header tbody {
  display: block;
  width: 100%;
  overflow: auto;
  height: 78vh;
}

.fixed_header thead tr {
  display: block;
}

.fixed_header th,
.fixed_header td {
  padding: 5px;
  width: 900px;
  border-width: 1px;
}

.loading {
  position: absolute;
  /* background: antiquewhite; */
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: fit-content;
  width: fit-content;
}
.col-cb {
  display: flex;
  justify-content: center;
  margin-top: 3px;
  color: grey;
}
.col-link {
  text-decoration: none;
}
.row-select {
  display: flex;
  justify-content: center;
  height: 34px;
  padding: 5px;
  padding-top: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.row-select:hover {
  transform: scale(1.4, 1.4);
}
.row-checked {
  color: #007bff;
}
.row-unchecked {
  color: rgb(200, 200, 200);
}
.g3-sequence {
  color: rgb(160, 159, 159);
}
</style>
