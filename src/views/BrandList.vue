<template>
  <div class="container" style="margin-top: 60px">
    <div v-show="!showItem">
      <BaseTitle :title="title" :sub-title="subTitle" />
      <div class="border table-action-bar">
        <div class="d-flex">
          <BaseSearchBar
            :search-text="searchText"
            @search-attempt="onSearchAttempt"
          />
          <!-- Active base filter -->
          <BaseButtonGroup
            :buttons="activeFilterButtons"
            @change-option="changeActiveOption"
          />
        </div>
        <!-- Action menu to the right -->
        <BaseTableAction
          :selected-count="selectedItems.length"
          @action-refresh="getData"
          @action-add="showItemDetail('new')"
          @action-delete="deleteRows"
        />
      </div>
      <pulse-loader class="loading" :loading="data_loading"></pulse-loader>

      <table
        class="table table-hover table-sm table-sortable table-bordered table-striped fixed_header"
        style="width: 100%"
      >
        <thead class="thead-light text-center">
          <tr>
            <th colspan="2" scope="col" style="width: 10%">
              <BaseHeadingSelect
                :selected="selectedItems.length > 0"
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
          <tr v-for="(item, index) in data" :key="item.id">
            <!-- Row select -->
            <td class="p-0 flex-fill" @click="rowSelected(item.id)">
              <i
                class="fa fa-check row-select"
                :class="[
                  isRowChecked(item.id) ? 'row-checked' : 'row-unchecked',
                ]"
              />
            </td>
            <!-- record sequence # -->
            <td class="text-right" sytle="white-space: nowrap; width: 7%">
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
      <div class="d-flex justify-content-between">
        <div class="">
          <BaseTotalRows
            :showing="pagination.pageSize"
            :total-rows="totalRows"
            :selected="selectedItems.length"
            :no-results-msg="noResultsMsg"
          />
        </div>
        <div class="">
          <BasePagination
            :pagination="pagination"
            on-change-page-number-change-page-size="
          on-change-page-size-
          @change-page-number="
          />
        </div>
      </div>
    </div>
    <!-- Add/update item -->
    <BrandItem
      v-show="showItem"
      :item="selectedItem"
      :status="itemDetailStatus"
      @item-closed="closeItemDetail"
    />
  </div>
</template>

<script>
import BrandService from "../services/BrandService";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import BrandItem from "@/views/BrandItem.vue";
import _ from "lodash";
import utils from "../utils/jsUtils.js";
import Vue from "vue";
import VueToast from "vue-toast-notification";
// Import one of the available themes
import "vue-toast-notification/dist/theme-default.css";
import "vue-toast-notification/dist/theme-sugar.css";
import date from "date-and-time";

Vue.use(VueToast);

export default {
  components: {
    PulseLoader,
    BrandItem,
  },
  props: [],
  data() {
    return {
      data_loading: false,
      data: [],
      selectedItems: [],
      selectedItem: {},
      showItem: false,
      itemDetailStatus: "new",
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
      currentSort: "modifiedOn",
      currentSortDir: "desc",
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
    };
  },
  computed: {},
  async created() {},
  async mounted() {
    // runs when the element is injected into the browser
    this.getData();
  },
  methods: {
    formatDate: function (rawDate) {
      return date.format(new Date(rawDate), "MM/DD/YYYY h:mm A");
    },

    rowSelected: function (id) {
      utils.arrToggle(this.selectedItems, id);
    },
    isRowChecked: function (id) {
      // Is this id in the selectedItems array?
      return this.selectedItems.indexOf(id) !== -1;
    },
    headingSelectChanged: function (checked) {
      // If checked, select all rows
      this.selectedItems = checked ? _.map(this.data, "id") : [];
    },
    headingAction: async function (action) {
      let i = 0;
      switch (action) {
        case "select-all":
          this.headingSelectChanged(true);
          break;
        case "un-select-all":
          this.headingSelectChanged(false);
          break;
        default:
          try {
            // Change records to active / inactive
            // Cycle through selected items
            const promises = this.selectedItems.map(async (itemId) => {
              const foundItem = _.find(this.data, { id: itemId });
              foundItem.active = action === "change-active" ? true : false;
              // Save record to db
              this.data_loading = true;
              await BrandService.saveBrand(foundItem);
              this.data_loading = false;
              i++;
              console.log("i", i);
              return;
            });
            await Promise.all(promises);
            // Success
            const msg = `Successfully changed ${
              i >= 200 ? "maximum of 200" : i
            } records`;
            Vue.$toast.open({
              message: msg,
              type: "success",
              duration: 5000,
            });
          } catch (err) {
            console.error(`Error saving record: ${err}`);
            Vue.$toast.open({
              message: `Error saving record: ${err}`,
              type: "danger",
              duration: 5000,
            });
          }
          break;
      }
    },
    deleteRows: async function () {
      // Delete all rows selected
      let i = 0;
      try {
        // Cycle through selected items
        if (!this.selectedItems) return;
        if (this.selectedItems.length === 0) return;

        const promises = this.selectedItems.map(async (itemId) => {
          const foundItem = _.find(this.data, { id: itemId });
          // Delete record from db
          this.data_loading = true;
          await BrandService.deleteBrand(foundItem.id);
          this.data_loading = false;
          i++;
          return;
        });
        await Promise.all(promises);
        this.getData();
        // Success
        const msg = `Successfully deleted ${
          i >= 200 ? "maximum of 200" : i
        } records`;
        Vue.$toast.open({
          message: msg,
          type: "success",
          duration: 5000,
        });
      } catch (err) {
        console.error(`Error saving record: ${err}`);
        Vue.$toast.open({
          message: `Error saving record: ${err}`,
          type: "danger",
          duration: 5000,
        });
      }
    },
    getSequenceNum: function (index) {
      if (this.pagination.pageSize === "All") {
        return index + 1;
      } else {
        return (
          this.pagination.pageSize * this.pagination.currentPage -
          this.pagination.pageSize +
          index +
          1
        );
      }
    },

    onSearchAttempt: function (searchText) {
      this.searchText = searchText;
      // Server-side filtering
      this.getData();
    },
    onChangePageSize: function (newPageSize) {
      if (newPageSize !== this.pagination.pageSize) {
        this.pagination.pageSize = newPageSize;
        this.getData();
      }
    },
    onChangePageNumber: function (newPageNumber) {
      if (newPageNumber !== this.pagination.currentPage) {
        this.pagination.currentPage = newPageNumber;
        this.getData();
      }
    },
    changeActiveOption: function (activeOption) {
      this.filter = "";
      if (activeOption === "active") this.filter = "active=true";
      else if (activeOption === "inactive") this.filter = "active=false";
      this.getData();
      // }
    },
    addBrand: function () {
      this.$router.push({
        name: "brand-item",
        params: {
          item: "new",
        },
      });
    },
    showItemDetail: function (item) {
      if (item === "new") {
        this.selectedItem = {};
        // Change so BrandItem Watch fires???
        this.itemDetailStatas = "null";
        this.itemDetailStatus = "new";
      } else {
        this.selectedItem = item;
        this.itemDetailStatas = "null";
        this.itemDetailStatus = "update";
      }
      this.showItem = true;

      // this.$router.push({
      //   name: "brand-item",
      //   params: {
      //     item: item,
      //   },
      // });
    },
    closeItemDetail: async function (detailItem) {
      try {
        this.showItem = false;
        console.log("detailItem", detailItem);
        if (detailItem === "cancel") return null;
        // If detailItem is found in list, update it
        // Otherwise, add to first of data items array
        if (detailItem.id === "") {
          // Save new item to db and add to data array
          this.data_loading = true;
          await BrandService.createBrand(detailItem);
          // utils.upsertArray(this.data, newItem);
          // Sort by createdOn desc
          this.currentSort = "modifiedOn";
          this.currentSortDir = "asc";
          this.sort("modifiedOn");
          // Toast: New item added
          const msg = `Successfully added brand ${detailItem.brandName} to database`;
          Vue.$toast.open({
            message: msg,
            type: "success",
            duration: 5000,
          });
        } else {
          // Update existing
          await BrandService.saveBrand(detailItem);
          const msg = `Successfully updated brand ${detailItem.brandName} to database`;
          Vue.$toast.open({
            message: msg,
            type: "success",
            duration: 5000,
          });
          // utils.upsertArray(this.data, detailItem);
        }
      } catch (err) {
        console.error(`Error closing Item Detail record: `, err);
      } finally {
        this.data_loading = false;
      }
    },
    getSortIndicator(field) {
      // Show indicator if current column is being sorted
      if (this.currentSort === field) {
        return this.sortIndicator;
      } else {
        // not on this column: send nothing
        return "";
      }
    },
    sort(field) {
      // 2-way sort only: asc, desc
      if (field !== this.currentSort) {
        this.currentSort = field;
        // Reset sort direction
        this.currentSortDir = "asc";
        this.sortIndicator = "fa-sort-up";
      } else if (this.currentSortDir === "asc") {
        this.currentSortDir = "desc";
        this.sortIndicator = "fa-sort-down";
        this.currentSort = field;
      } else if (this.currentSortDir === "desc") {
        this.currentSortDir = "asc";
        this.sortIndicator = "fa-sort-up";
        this.currentSort = field;
      }
      // Client or server-side sorting?
      if (this.pagination.maxPages === 1) {
        // All records are retrieved: Client sort
        this.data = _.orderBy(this.data, this.currentSort, this.currentSortDir);
      } else {
        // Server-side sorting
        this.getData();
      }
    },
    async getData() {
      try {
        this.data_loading = true;
        const response = await BrandService.getBrands(
          this.pagination.pageSize,
          this.pagination.currentPage,
          this.currentSort,
          this.currentSortDir,
          this.searchText,
          this.filter
        );

        if (response.data.totalRows === undefined) {
          // No results
          this.noResultsMsg = "No matches";
          this.data = [];
          this.totalRows = 0;
          this.pagination.maxPages = 0;
        } else {
          // Results
          this.noResultsMsg = "";
          this.data = response.data.results;
          this.totalRows = response.data.totalRows;
          this.pagination.maxPages = response.data.maxPages;
          // this.pagination.previousPage = response.data.previousPage
          // this.pagination.nextPage = response.data.nextPage
        }
        this.data_loading = false;
      } catch (error) {
        console.log(`There was an error: ${error.response}`);
      }
    },
  },
};
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
.table-action-bar {
  display: flex;
  justify-content: space-between;
  background-color: RGB(248, 248, 248);
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
</style>
