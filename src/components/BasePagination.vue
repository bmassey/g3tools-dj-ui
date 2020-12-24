<template>
  <div class="d-flex justify-content-end">
    <div>
      <label class="d-inline-block mr-2" for="rowsPerPage">Rows per page</label>
      <select
        v-model="pageSize"
        name="rowsPerPage"
        class="d-inline-block custom-select mr-3 "
        style="width: auto;"
        v-on:change="changePageSize"
      >
        <option>10</option>
        <option>25</option>
        <option>50</option>
        <option>100</option>
        <option>200</option>
        <option>5000</option>
      </select>
    </div>
    <nav aria-label="Table pagination" v-show="pagination.maxPages > 1">
      <ul class="pagination justify-content-end">
        <!-- First page button -->
        <li
          class="page-item "
          :class="{ disabled: pagination.currentPage === 1 }"
        >
          <a
            class="page-link"
            href="#"
            :tabindex="pagination.currentPage === 1 ? '-1' : ''"
            v-on:click="changePageNumber(1)"
            >First</a
          >
        </li>
        <!-- Previous page button -->
        <li
          class="page-item"
          :class="{ disabled: pagination.currentPage === 1 }"
        >
          <a
            class="page-link"
            href="#"
            :tabindex="pagination.currentPage === 1 ? '-1' : ''"
            v-on:click="changePageNumber(pagination.currentPage - 1)"
            >Previous</a
          >
        </li>
        <!-- Pagination buttons based on page number -->
        <li
          class="page-item"
          v-for="(page, index) in pageArray"
          :key="index"
          :class="{ active: pagination.currentPage === page }"
        >
          <a class="page-link" href="#" v-on:click="changePageNumber(page)">{{
            page
          }}</a>
        </li>
        <!-- Next page button -->
        <li
          class="page-item"
          :class="{
            disabled: pagination.currentPage === pagination.maxPages
          }"
        >
          <a
            class="page-link"
            href="#"
            :tabindex="
              pagination.currentPage === pagination.maxPages ? '-1' : ''
            "
            v-on:click="changePageNumber(pagination.currentPage + 1)"
            >Next</a
          >
        </li>
        <!-- Last page button -->
        <li
          class="page-item"
          :class="{ active: pagination.currentPage === pagination.maxPages }"
        >
          <a
            class="page-link"
            href="#"
            :tabindex="
              pagination.currentPage === pagination.maxPages ? '-1' : ''
            "
            v-on:click="changePageNumber(pagination.maxPages)"
            >Last</a
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import utils from "../utils/jsUtils.js"
import config from "../../config.js"

export default {
  props: {
    pagination: Object
    // pagination: {
    //   pageSize: 25,
    //   currentPage: 1,
    //   maxPages: 2,
    //   previousPage: 0,
    //   nextPage: 2,
    // },
  },
  data() {
    return {
      pageSize: this.pagination.pageSize
    }
  },
  components: {},
  computed: {
    // Create array
    pageArray: function() {
      const configPages = config.maxTablePages
      let newArray = utils.createNumberArray(1, configPages)
      const halfFloor = Math.floor(configPages / 2)
      const halfCeiling = Math.ceil(configPages / 2)
      //[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      // For 10 pages, if current page is 4 or below, use default 1-10 pages
      // If current page is > max page - 4 (like 81 for 85 max pages),
      //  create pages from 76-85. Otherwise, try and keep the active page in middle
      if (this.pagination.currentPage <= halfFloor) return newArray
      else if (
        this.pagination.currentPage >=
        this.pagination.maxPages - halfFloor
      ) {
        // High end
        newArray = utils.createNumberArray(
          this.pagination.maxPages - (configPages - 1),
          this.pagination.maxPages
        )
      } else {
        // Page location is somewhere in the middle
        // Mid-range location: create pages so that current page is rougly mid-point
        newArray = utils.createNumberArray(
          this.pagination.currentPage - halfFloor,
          this.pagination.currentPage + halfCeiling
        )
      }
      return newArray
    }
  },
  methods: {
    changePageSize() {
      if (this.pageSize === "All") this.pageSize = -1
      this.$emit("change-page-size", parseInt(this.pageSize))
    },
    changePageNumber(page) {
      this.$emit("change-page-number", parseInt(page))
    }
  }
}
</script>

<style lang="css" scoped></style>
