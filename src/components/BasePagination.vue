<template>
  <div class="d-flex justify-content-end">
    <div>
      <label class="d-inline-block mr-2" for="rowsPerPage">Page size</label>
      <select
        v-model="localPageSize"
        name="rowsPerPage"
        class="d-inline-block custom-select mr-3"
        :disabled="state.dataLoading"
        style="width: auto"
        @change="pageSizeSet"
      >
        <option>10</option>
        <option>25</option>
        <option>50</option>
        <option>100</option>
        <option>200</option>
        <option>5000</option>
      </select>
    </div>
    <nav v-show="state.totalPages > 1" aria-label="Table pagination">
      <ul class="pagination justify-content-end">
        <!-- First page button -->
        <li
          class="page-item"
          :class="{ disabled: page === 1 || state.dataLoading }"
        >
          <router-link
            class="page-link"
            :to="{ name: routeName, query: { page: 1 } }"
            rel="prev"
          >
            &lt;&lt;</router-link
          >
        </li>
        <!-- Previous page button -->
        <li
          class="page-item prev-page"
          :class="{ disabled: page === 1 || state.dataLoading }"
        >
          <router-link
            class="page-link"
            :to="{ name: routeName, query: { page: page - 1 } }"
            rel="prev"
          >
            &lt;</router-link
          >
        </li>
        <!-- Pagination buttons based on page number -->
        <li
          v-for="(usePage, index) in pageArray"
          :key="index"
          class="page-item"
          :class="[
            {
              active: page === usePage
            },
            { disabled: state.dataLoading && page !== usePage }
          ]"
        >
          <router-link
            class="page-link"
            :to="{ name: routeName, query: { page: usePage } }"
            rel="next"
          >
            {{ usePage }}</router-link
          >
        </li>
        <!-- Max page -->
        <template v-if="showMaxPage">
          <p class="elipsis">...</p>
          <li
            class="page-item"
            :class="{
              disabled: page === state.totalPages || state.dataLoading
            }"
          >
            <router-link
              class="page-link"
              :to="{ name: routeName, query: { page: state.totalPages } }"
              rel="next"
            >
              {{ state.totalPages }}</router-link
            >
          </li>
        </template>
        <!-- Next page button -->
        <li
          class="page-item next-page"
          :class="{
            disabled: page === state.totalPages || state.dataLoading
          }"
        >
          <router-link
            class="page-link"
            :to="{ name: routeName, query: { page: page + 1 } }"
            rel="next"
          >
            &gt;</router-link
          >
        </li>
        <!-- Last page button -->
        <li
          class="page-item"
          :class="{ disabled: page === state.totalPages || state.dataLoading }"
        >
          <router-link
            class="page-link"
            :to="{ name: routeName, query: { page: state.totalPages } }"
            rel="last"
          >
            &gt;&gt;</router-link
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import utils from '../utils/jsUtils.js'
import config from '../../config.js'
// import { mapState, mapActions } from 'vuex'

export default {
  props: {
    namespace: { type: String, default: '' }
  },
  data() {
    return {
      localPageSize: 0
    }
  },
  computed: {
    // Create array
    pageArray: function () {
      return this.createPageArray()
    },
    showMaxPage() {
      const lastItem = this.pageArray[this.pageArray.length - 1]
      return lastItem < this.state.totalPages
    },
    routeName() {
      return `${this.namespace.toLowerCase()}-list`
    },
    page() {
      const newPage = parseInt(this.$route.query.page) || 1
      return newPage
    },
    state() {
      return this.$store.state[this.namespace]
    }
  },
  beforeMount() {
    this.localPageSize = this.state.pageSize
  },
  methods: {
    pageSizeSet() {
      this.$store.dispatch(
        `${this.namespace}/pageSizeSet`,
        parseInt(this.localPageSize)
      )
      this.$store.dispatch(`${this.namespace}/fetchItems`, true)
    },
    createPageArray() {
      let newArray = []
      const configPages = config.maxTablePages
      const firstItem = this.state.pageArray[0]
      const lastItem = this.state.pageArray[this.state.pageArray.length - 1]

      // Deterimine the array of pagination buttons
      if (this.page < configPages) {
        // Low end (1-7)
        newArray = utils.createNumberArray(1, configPages)
      } else if (this.page > this.state.totalPages - configPages) {
        // High end: Show top page numbers
        newArray = utils.createNumberArray(
          this.state.totalPages - configPages,
          this.state.totalPages
        )
      } else {
        // Page location is somewhere in the middle
        // Always have the next page on the bottom or top of the list
        let from = firstItem
        let to = lastItem
        if (this.page === firstItem) {
          // Bottom of range
          from = firstItem - 1
          to = from + 6
        } else if (this.page === lastItem) {
          // Top of range
          to = lastItem + 1
          from = to - 6
        }
        newArray = utils.createNumberArray(from, to)
      }
      this.$store.dispatch(`${this.namespace}/pageArraySet`, [...newArray])
      return newArray
    }
  }
}
</script>

<style lang="css" scoped>
.next-page {
  margin-left: 12px;
}
.prev-page {
  margin-right: 12px;
}
.elipsis {
  margin-bottom: 0px;
  margin-top: 15px;
  margin-left: 1px;
  margin-right: 1px;
}
.page-link {
  width: 37px;
  padding-left: 0px;
  padding-right: 0px;
  text-align: center;
}
</style>
