<template>
  <div class="container" style="margin-top: 60px">
    <BaseTitle :title="state.title" :sub-title="state.subTitle" />
    <div class="border table-action-bar">
      <div class="d-flex">
        <BaseSearchBar :namespace="namespace" />
        <!-- Active basic filter -->
        <BaseButtonGroup :namespace="namespace" />
      </div>
      <!-- Action menu to the right -->
      <BaseTableAction
        :namespace="namespace"
        @action-add="showItemDetail('new')"
        @action-delete="deleteRows"
      />
    </div>
    <pulse-loader class="loading" :loading="state.dataLoading"></pulse-loader>

    <table
      class="table table-hover table-sm table-sortable table-bordered table-striped fixed_header"
      style="width: 100%"
    >
      <thead class="thead-light text-center">
        <tr>
          <th colspan="2" scope="col" style="width: 10%">
            <BaseHeadingSelect :namespace="namespace" />
          </th>
          <!-- Column headings array from props -->
          <template v-for="column in columns">
            <th
              :key="column.dbName"
              scope="col"
              :style="
                column.headingWidthPct !== -1
                  ? { width: `${column.headingWidthPct}%` }
                  : ''
              "
              @click="sort(`${column.dbName}`)"
            >
              {{ column.headingName }}
              <span
                class="fa fa-fw"
                :class="getSortIndicator(column.dbName)"
              ></span>
            </th>
          </template>
        </tr>
      </thead>
      <tbody class="my-tbody">
        <!-- Table data rows -->
        <tr v-for="(item, index) in state.items" :key="item.id">
          <!-- Row select -->
          <td class="p-0 flex-fill" @click="rowSelected(item.id)">
            <i
              class="fa fa-check row-select"
              :class="[isRowChecked(item.id) ? 'row-checked' : 'row-unchecked']"
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
          <!-- Data defined in columns array -->
          <template v-for="field in columns">
            <td
              :key="field.dbName"
              :style="
                field.dataWidthPct !== -1
                  ? {
                      whiteSpace: 'noWrap',
                      width: `${field.dataWidthPct}%`
                    }
                  : { whiteSpace: 'noWrap' }
              "
              @click="
                field.columnType === 'link' ? showItemDetail(item.id) : null
              "
            >
              <a v-if="field.columnType === 'link'" class="col-link" href="#">{{
                item[field.dbName]
              }}</a>
              <i
                v-if="field.columnType === 'checkbox'"
                class="col-cb"
                :class="{ 'fa fa-check': item[field.dbName] }"
              />
              <template v-if="field.columnType === 'datetime'">{{
                formatDate(item[field.dbName])
              }}</template>
              <template v-if="field.columnType === 'text'">{{
                item[field.dbName]
              }}</template>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-between">
      <div class="">
        <BaseTotalRows
          :namespace="namespace"
          :selected="state.selectedItems.length"
          :no-results-msg="'No results'"
        />
      </div>
      <div class="">
        <BasePagination :namespace="namespace" />
      </div>
    </div>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import date from 'date-and-time'

export default {
  components: {
    PulseLoader
  },
  props: {
    namespace: { type: String, default: '' },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    data: []
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    },
    getSortIndicator() {
      return this.$store.getters[`${this.namespace}/getSortIndicator`]
    }
  },
  methods: {
    deleteRows: async function () {
      // // Delete all rows selected
      // let i = 0
      // try {
      //   // Cycle through selected items
      //   if (!this.state.selectedItems) return
      //   if (this.state.selectedItems.length === 0) return
      //   const promises = this.state.selectedItems.map(async (itemId) => {
      //     const foundItem = _.find(this.state.brands, { id: itemId })
      //     // Delete record from db
      //     this.$store.dispatch('brand/dataLoadingSet', true)
      //     await BrandService.deleteBrand(foundItem.id)
      //     this.$store.dispatch('brand/dataLoadingSet', false)
      //     i++
      //     return
      //   })
      //   await Promise.all(promises)
      //   // this.fetchData()
      //   // Success
      //   const msg = `Successfully deleted ${
      //     i >= 200 ? 'maximum of 200' : i
      //   } records`
      //   Vue.$toast.open({
      //     message: msg,
      //     type: 'success',
      //     duration: 5000
      //   })
      // } catch (err) {
      //   console.error(`Error saving record: ${err}`)
      //   Vue.$toast.open({
      //     message: `Error saving record: ${err}`,
      //     type: 'danger',
      //     duration: 5000
      //   })
      // }
    },
    formatDate: function (rawDate) {
      return date.format(new Date(rawDate), 'MM/DD/YYYY h:mm A')
    },

    getSequenceNum: function (index) {
      if (this.state.pageSize === -1) {
        return index + 1
      } else {
        // Calculate sequence based page
        if (this.page === this.state.pageInStore) {
          // Completed fetching records, since page data matches current page #
          return (
            this.state.pageSize * this.page - this.state.pageSize + index + 1
          )
        } else {
          // Still fetching data, get prev page
          return (
            this.state.pageSize * this.state.pageInStore -
            this.state.pageSize +
            index +
            1
          )
        }
      }
    },
    isRowChecked: function (id) {
      // Is this id in the selectedItems array?
      return this.state.selectedItems.indexOf(id) !== -1
    },
    rowSelected: function (id) {
      const index = this.state.selectedItems.indexOf(id)
      if (index === -1) {
        // This id not in array; add it
        this.$store.dispatch(`${this.namespace}/selectedItemsAdd`, id)
      } else {
        // This id in the array, remove it
        this.$store.dispatch(`${this.namespace}/selectedItemsRemove`, index)
      }
    },
    showItemDetail: function (id) {
      if (id === 'new') {
        // new item
        this.$router.push({
          name: 'brand-item',
          params: {
            id: -1,
            mode: 'new'
          }
        })
      } else {
        // show existing item
        this.$router.push({
          name: 'brand-item',
          params: {
            id: id,
            mode: 'update'
          }
        })
      }
    },
    sort(field) {
      this.$store.dispatch(`${this.namespace}/sort`, field)
    }
  }
}
</script>

<style lang="css" scoped>
.table-action-bar {
  display: flex;
  justify-content: space-between;
  background-color: RGB(248, 248, 248);
  padding: 10px;
  border: 1px;
}
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
