<template>
  <div class="container">
    <h3>Brand List</h3>
    <table
      class="table table-hover table-sm table-sortable table-bordered table-striped"
    >
      <!-- <caption>
        List of Brands
      </caption> -->
      <thead class="thead-light">
        <tr>
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
        <tr v-for="item in data" :key="item.id">
          <td>{{ item.brandName }}</td>
          <td>{{ item.abbreviation }}</td>
          <td>{{ item.vendorName }}</td>
          <td>{{ item.active }}</td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="...">
      <ul class="pagination justify-content-end">
        <li class="page-item disabled">
          <a class="page-link" href="#" tabindex="-1">Previous</a>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item active">
          <a class="page-link" href="#"
            >2 <span class="sr-only">(current)</span></a
          >
        </li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>
    <!-- debug: sort={{ currentSort }}, dir={{ currentSortDir }} -->
  </div>
</template>

<script>
import BrandService from "../services/BrandService"

export default {
  props: [],
  data() {
    return {
      data_fetched: false,
      data: [],
      currentSort: "brandName",
      currentSortDir: "asc",
      pageSize: 25,
      currentPage: 1,
      sortIndicator: "fa-sort-down",
    }
  },
  async created() {
    try {
      const response = await BrandService.getBrands()
      this.data = response.data.results
    } catch (error) {
      console.log(`There was an error: ${error.response}`)
    }
  },
  mounted() {
    // runs when the element is injected into the browser
  },
  computed: {},
  methods: {
    getSortIndicator(field) {
      // Show indicator if current column is being sorted
      if (this.currentSort === field) {
        return this.sortIndicator
        // if (this.currentSortDir === "asc") return "fa-sort-down"
        // else if (this.currentSortDir === "desc") return "fa-sort-up"
        // else return "fa-sort"
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
      try {
        const response = await BrandService.getBrands(
          this.pageSize,
          this.currentSort,
          this.currentSortDir
        )
        this.data = response.data.results
      } catch (error) {
        console.log(`There was an error: ${error.response}`)
      }
    },

    // sort: function(s) {
    //   //if s == current sort, reverse
    //   if (s === this.currentSort) {
    //     this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc"
    //   }
    //   this.currentSort = s
    // },
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
/*.table-sortable > thead > tr > th:after,
.table-sortable > thead > tr > th:after,
.table-sortable > thead > tr > th:after {
  content: " ";
  position: absolute;
  height: 0;
  width: 0;
  right: 10px;
  top: 16px;
}
.table-sortable > thead > tr > th:after {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #ccc;
  border-bottom: 0px solid transparent;
}

.table-sortable > thead > tr > th:hover:after {
  border-top: 5px solid #888;
}

.table-sortable > thead > tr > th.asc:after {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 0px solid transparent;
  border-bottom: 5px solid #333;
}
.table-sortable > thead > tr > th.asc:hover:after {
  border-bottom: 5px solid #888;
}

.table-sortable > thead > tr > th.desc:after {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #333;
  border-bottom: 5px solid transparent;
} */
</style>
