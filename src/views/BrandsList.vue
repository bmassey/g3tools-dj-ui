<template>
  <div class="container">
    <h4>Brand List</h4>
    <div class="row">
      <div class="col-sm  align-self-end">
        <BaseTotalRows
          :showing="pagination.pageSize"
          :totalRows="totalRows"
          :noResultsMsg="noResultsMsg"
        />
      </div>
      <div class="col-sm align-self-center">
        <BaseSearchBar
          :searchText="searchText"
          v-on:search-attempt="onSearchAttempt"
        />
      </div>
      <div class="col-sm align-self-center"></div>
    </div>
    <pulse-loader class="loading" :loading="data_loading"></pulse-loader>

    <table
      class="table table-hover table-sm table-sortable table-bordered table-striped"
    >
      <thead class="thead-light">
        <tr>
          <th scope="col" />
          <th scope="col" @click="sort('brandName')">
            Brand Name
            <span
              class="fa fa-fw"
              :class="getSortIndicator('brandName')"
            ></span>
          </th>
          <th scope="col" @click="sort('abbreviation')">
            Abbrev
            <span
              class="fa fa-fw"
              :class="getSortIndicator('abbreviation')"
            ></span>
          </th>
          <th scope="col" @click="sort('vendorName')">
            Vendor Name
            <span
              class="fa fa-fw"
              :class="getSortIndicator('vendorName')"
            ></span>
          </th>
          <th scope="col" @click="sort('active')">
            Active
            <span class="fa fa-fw" :class="getSortIndicator('active')"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="item.id">
          <!-- record sequence # -->
          <td>
            {{
              pagination.pageSize * pagination.currentPage -
                pagination.pageSize +
                index +
                1
            }}
          </td>
          <td>{{ item.brandName }}</td>
          <td>{{ item.abbreviation }}</td>
          <td>{{ item.vendorName }}</td>
          <td>{{ item.active }}</td>
        </tr>
      </tbody>
    </table>
    <BasePagination
      :pagination="pagination"
      v-on:change-page-size="onChangePageSize"
      v-on:change-page-number="onChangePageNumber"
    />
  </div>
</template>

<script>
import BrandService from "../services/BrandService"
import PulseLoader from "vue-spinner/src/PulseLoader.vue"

export default {
  props: [],
  data() {
    return {
      data_loading: false,
      data: [],
      totalRows: 1,
      noResultsMsg: "",
      currentRows: 1,
      pagination: {
        pageSize: 25,
        currentPage: 1,
        maxPages: 2,
        previousPage: 0,
        nextPage: 2,
      },
      currentSort: "brandName",
      currentSortDir: "asc",
      sortIndicator: "fa-sort-down",
      searchText: "",
    }
  },
  components: {
    PulseLoader,
  },
  async created() {},
  async mounted() {
    // runs when the element is injected into the browser
    this.getData()
  },
  computed: {},
  methods: {
    onSearchAttempt: function(searchText) {
      this.searchText = searchText
      // if (searchText === "") this.getData()
      this.getData()
    },
    onChangePageSize: function(newPageSize) {
      if (newPageSize !== this.pagination.pageSize) {
        console.log("onChangePageSize: ", this.searchText)
        this.pagination.pageSize = newPageSize
        this.getData()
      }
    },
    onChangePageNumber: function(newPageNumber) {
      if (newPageNumber !== this.pagination.currentPage) {
        this.pagination.currentPage = newPageNumber
        this.getData()
      }
    },
    getSortIndicator(field) {
      // Show indicator if current column is being sorted
      if (this.currentSort === field) {
        return this.sortIndicator
      } else {
        // not on this column: send nothing
        return ""
      }
    },
    async sort(field) {
      // 3-way sort: asc, desc, and no sort
      if (field !== this.currentSort) {
        this.currentSort = field
        // Reset sort direction
        this.currentSortDir = "asc"
        this.sortIndicator = "fa-sort-down"
      } else if (this.currentSortDir === "asc") {
        this.currentSortDir = "desc"
        this.sortIndicator = "fa-sort-up"
        this.currentSort = field
      } else if (this.currentSortDir === "desc") {
        this.currentSortDir = ""
        this.sortIndicator = "fa-sort"
        this.currentSort = ""
      } else if (this.currentSortDir === "") {
        this.currentSortDir = "asc"
        this.sortIndicator = "fa-sort-down"
        this.currentSort = field
      }
      await this.getData()
    },
    async getData() {
      try {
        this.data_loading = true
        const response = await BrandService.getBrands(
          this.pagination.pageSize,
          this.pagination.currentPage,
          this.currentSort,
          this.currentSortDir,
          this.searchText
        )

        if (response.data.totalRows === undefined) {
          // No results
          this.noResultsMsg = "No matches"
          this.data = []
          this.totalRows = 0
          this.pagination.maxPages = 0
        } else {
          // Results
          this.noResultsMsg = ""
          this.data = response.data.results
          this.totalRows = response.data.totalRows
          this.pagination.maxPages = response.data.maxPages
          // this.pagination.previousPage = response.data.previousPage
          // this.pagination.nextPage = response.data.nextPage
        }
        this.data_loading = false
      } catch (error) {
        console.log(`There was an error: ${error.response}`)
      }
    },
  },
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
  background-color: rgb(224, 224, 224);
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
</style>
