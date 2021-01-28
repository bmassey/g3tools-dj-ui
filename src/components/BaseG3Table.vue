<template>
  <b-overlay :opacity="0.5" :show="state.dataLoading">
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
        />
      </div>
      <!-- No results found text -->
      <div
        v-if="state.totalRows === 0 && !state.dataLoading"
        class="centered empty-text"
      >
        {{ emptyText }}
      </div>
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
                class="unselectable"
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
            <td
              class="p-0 flex-fill"
              style="width: 4%"
              @click.left.exact="rowSelected(item.id)"
              @click.shift.left.exact="rowSelectedShift(item.id)"
            >
              <i
                class="fa fa-check row-select"
                :class="[
                  isRowChecked(item.id) ? 'row-checked' : 'row-unchecked'
                ]"
              />
            </td>
            <!-- record sequence # -->
            <td
              class="text-right g3-sequence unselectable"
              sytle="white-space: nowrap; width: 6%"
            >
              {{ createSequenceNum(index) }}
              <!-- {{ index }} -->
            </td>
            <!-- Data defined in columns array. -->
            <template v-for="field in columns">
              <td
                :key="field.dbName"
                class="unselectable"
                :style="
                  field.dataWidthPct !== -1
                    ? {
                        whiteSpace: 'noWrap',
                        width: `${field.dataWidthPct}%`
                      }
                    : { whiteSpace: 'noWrap' }
                "
                @click="
                  field.columnType === 'link' ? showItemDetail(item) : null
                "
              >
                <a
                  v-if="field.columnType === 'link'"
                  class="col-link"
                  href="#"
                  >{{ item[field.dbName] }}</a
                >
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
  </b-overlay>
</template>

<script>
import date from 'date-and-time'

export default {
  components: {},
  props: {
    namespace: { type: String, default: '' },
    emptyText: { type: String, default: 'No results found' },
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
    formatDate: function (rawDate) {
      return date.format(new Date(rawDate), 'MM/DD/YYYY h:mm A')
    },

    createSequenceNum: function (index) {
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
    getPrevSequenceNum: function (id) {
      // Given an item id, find the index of the previously selected item
      const index = this.state.items.indexOf(id)
      return index
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
    rowSelectedShift: function (id) {
      // Find sequence number of this item id
      const itemIndex = this.state.items.findIndex((item) => item.id === id)
      let i = itemIndex
      // Cycle through items list backwards from this index and find next selected
      for (i; i >= 0; i--) {
        const itemId = this.state.items[i].id
        if (this.state.selectedItems.indexOf(itemId) > -1) {
          break
        }
        // Not selected: Add to selected items list
        this.$store.dispatch(`${this.namespace}/selectedItemsAdd`, itemId)
      }
    },
    showItemDetail: function (item) {
      if (item === 'new') {
        // new item
        console.log('showItemDetail', this.namespace)
        this.$router.push({
          name: `${this.namespace.toLowerCase()}-item`,
          params: {
            id: -1,
            mode: 'new'
          }
        })
      } else {
        // Save item in store
        this.$store.dispatch(`${this.namespace}/itemSet`, item)
        // Route to item detail
        this.$router.push({
          name: `${this.namespace.toLowerCase()}-item`,
          params: {
            id: parseInt(item.id),
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
  transform: scale(1.2, 1.2);
}
.row-checked {
  color: #007bff;
}
.row-unchecked {
  color: transparent;
}
.row-unchecked:hover {
  transform: scale(1, 1);
  color: white;
}
.g3-sequence {
  color: rgb(160, 159, 159);
}
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.empty-text {
  height: 400px;
  font-weight: bold;
  color: #656565;
}
</style>
