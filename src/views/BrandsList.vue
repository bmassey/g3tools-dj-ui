<template>
  <div class="container" style="margin-top: 60px">
    <BaseTitle :title="title" :subTitle="subTitle" />
    <div class="mx-3 ">
      <div class="row border table-action-bar">
        <BaseSearchBar
          :searchText="searchText"
          @search-attempt="onSearchAttempt"
        />
        <!-- Active base filter -->
        <BaseButtonGroup
          :buttons="activeFilterButtons"
          @change-option="changeActiveOption"
        />
      </div>
    </div>
    <pulse-loader class="loading" :loading="data_loading"></pulse-loader>

    <table
      class="table table-hover table-sm table-sortable table-bordered table-striped fixed_header"
      style="width: 100%"
    >
      <thead class="thead-light text-center">
        <tr>
          <th scope="col" style="width: 5%" />
          <th scope="col" style="width: 5%" />
          <th scope="col" @click="sort('brandName')" style="width: 30%">
            Brand Name
            <span
              class="fa fa-fw"
              :class="getSortIndicator('brandName')"
            ></span>
          </th>
          <th scope="col" @click="sort('abbreviation')" style="width: 10%">
            Abbrev
            <span
              class="fa fa-fw"
              :class="getSortIndicator('abbreviation')"
            ></span>
          </th>
          <th scope="col" @click="sort('vendorName')" style="width: 30%">
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
      <tbody class="my-tbody">
        <tr v-for="(item, index) in data" :key="item.id">
          <!-- Row select -->
          <td><i class="fa fa-check row-select" /></td>
          <!-- record sequence # -->
          <td class="text-right" sytle="white-space: nowrap; width: 4%">
            {{ getSequenceNum(index) }}
            <!-- {{ index }} -->
          </td>
          <!-- Brand name -->
          <td style="white-space: nowrap; width: 30%">
            <a class="col-link" href="#">{{ item.brandName }}</a>
          </td>
          <!-- Abbreviation -->
          <td style="white-space: nowrap; width: 10%">
            {{ item.abbreviation }}
          </td>
          <!-- Vendor name -->
          <td style="white-space: nowrap; width: 30%">{{ item.vendorName }}</td>
          <!-- Active -->
          <td style="width: 20%">
            <i class="col-cb" :class="{ 'fa fa-check': item.active }" />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <div class="col-sm-3 align-self-start">
        <BaseTotalRows
          :showing="pagination.pageSize"
          :totalRows="totalRows"
          :noResultsMsg="noResultsMsg"
        />
      </div>
      <div class="col-sm-9 align-self-start">
        <BasePagination
          :pagination="pagination"
          @change-page-size="onChangePageSize"
          @change-page-number="onChangePageNumber"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BrandService from "../services/BrandService"
import PulseLoader from "vue-spinner/src/PulseLoader.vue"
import _ from "lodash"

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
        pageSize: 50,
        currentPage: 1,
        maxPages: 2,
        previousPage: 0,
        nextPage: 2,
      },
      currentSort: "brandName",
      currentSortDir: "asc",
      sortIndicator: "fa-sort-up",
      searchText: "",
      filter: "active=true",
      activeFilterButtons: [
        {
          btnName: "active",
          btnLabel: "Active",
          value: "active",
        },
        {
          btnName: "inactive",
          btnLabel: "Inactive",
          value: "inactive",
        },
        {
          btnName: "all",
          btnLabel: "All",
          value: "all",
        },
      ],
      title: "Brand List",
      subTitle:
        "Use this to maintain brands that are bought or sold. Assign a unique prefix, used in item numbers.",
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
    getSequenceNum: function(index) {
      if (this.pagination.pageSize === "All") {
        return index + 1
      } else {
        return (
          this.pagination.pageSize * this.pagination.currentPage -
          this.pagination.pageSize +
          index +
          1
        )
      }
    },

    onSearchAttempt: function(searchText) {
      this.searchText = searchText
      // Server-side filtering
      this.getData()
    },
    onChangePageSize: function(newPageSize) {
      if (newPageSize !== this.pagination.pageSize) {
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
    changeActiveOption: function(activeOption) {
      this.filter = ""
      if (activeOption === "active") this.filter = "active=true"
      else if (activeOption === "inactive") this.filter = "active=false"
      // 12/21/20: No client-side filtering possible, since we don't have
      // the entire dataset to filter on
      // // Client or server-side sorting?
      // if (this.pagination.maxPages === 1) {
      //   // All records are retrieved: Client sort
      //   this.data = _.filter(this.data, "active", activeOption === "active")
      // } else {
      // Server-side sorting
      this.getData()
      // }
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
    sort(field) {
      // 3-way sort: asc, desc, and no sort
      // 2-way sort only: asc, desc
      if (field !== this.currentSort) {
        this.currentSort = field
        // Reset sort direction
        this.currentSortDir = "asc"
        this.sortIndicator = "fa-sort-up"
      } else if (this.currentSortDir === "asc") {
        this.currentSortDir = "desc"
        this.sortIndicator = "fa-sort-down"
        this.currentSort = field
        // } else if (this.currentSortDir === "desc") {
        //   this.currentSortDir = ""
        //   this.sortIndicator = "fa-sort"
        //   this.currentSort = ""
      } else if (this.currentSortDir === "desc") {
        this.currentSortDir = "asc"
        this.sortIndicator = "fa-sort-up"
        this.currentSort = field
      }
      // Client or server-side sorting?
      if (this.pagination.maxPages === 1) {
        // All records are retrieved: Client sort
        this.data = _.orderBy(this.data, this.currentSort, this.currentSortDir)
      } else {
        // Server-side sorting
        this.getData()
      }
    },
    async getData() {
      try {
        this.data_loading = true
        const response = await BrandService.getBrands(
          this.pagination.pageSize,
          this.pagination.currentPage,
          this.currentSort,
          this.currentSortDir,
          this.searchText,
          this.filter
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
  background-color: rgba(206, 216, 235, 0.438);
}
.table-bordered {
  /* border-left: 0px; */
  border-top: 0px;
}
.table-action-bar {
  background-color: RGB(248, 248, 248);
  margin-left: -16px;
  margin-right: -16px;
  display: "flex";
  padding: 10px;
  border: 1px;
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
  height: 79vh;
}

.fixed_header thead tr {
  display: block;
}

.fixed_header th,
.fixed_header td {
  padding: 5px;
  width: 800px;
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
  margin-top: 3px;
  color: rgb(200, 200, 200);
}

/* table {
  width: auto;
}
td {
  white-space: nowrap;
}
table td:last-child {
  width: 100%;
} */
</style>
