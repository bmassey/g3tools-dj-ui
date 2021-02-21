<template>
  <tr class="thead-light text-center" v-if="state.showFilterRow">
    <th colspan="2">
      <b-button variant="primary" @click="applyFilter" class="apply-button">
        <!-- <i class="fas fa-filter" /> -->
        Apply
      </b-button>
    </th>
    <!-- Column headings array from props -->
    <template v-for="field in columns">
      <th :key="field.dbName">
        <!-- Select list -->
        <div
          class="d-flex"
          v-if="field.filterable && field.filterType === 'select'"
        >
          <b-form-select
            :options="field.filterOptions"
            :value="textValue(field.dbName)"
            @input="textChanged($event, field.dbName)"
          >
          </b-form-select>
          <!-- Clear selection button -->
          <button
            v-if="field.filterable && field.filterType === 'select'"
            class="btn bg-transparent search-cancel"
            @click="clear(field.dbName)"
          >
            <i class="fas fa-times color-secondary"></i>
          </button>
        </div>
        <!-- Text box -->
        <div
          class="d-flex"
          v-if="field.filterable && field.filterType === 'text'"
        >
          <b-form-input
            :value="textValue(field.dbName)"
            @input="textChanged($event, field.dbName)"
          />
          <!-- Clear selection button -->
          <button
            v-if="field.filterable && field.filterType === 'text'"
            class="btn bg-transparent search-cancel"
            @click="clear(field.dbName)"
          >
            <i class="fas fa-times color-secondary"></i>
          </button>
        </div>

        <!-- Checkbox -->
        <b-checkbox
          class="g3-checkbox"
          v-if="field.filterable && field.filterType === 'checkbox'"
        />
      </th>
    </template>
  </tr>
</template>

<script>
export default {
  props: {
    namespace: { type: String, default: '' }
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    },
    columns() {
      return this.state.columns
    }
  },
  methods: {
    textValue(fieldName) {
      var findColumn = this.state.columns.find((x) => x.dbName === fieldName)
      return findColumn.filteredValue
    },
    textChanged(value, fieldName) {
      this.$store.commit(`${this.namespace}/COLUMN_FILTERED_VALUE_SET`, {
        fieldName: fieldName,
        fieldValue: value
      })
    },
    clear(fieldName) {
      this.textChanged('', fieldName)
    },
    async applyFilter() {
      // Apply filter and fetch items
      await this.$store.dispatch(`${this.namespace}/filterApply`)
      this.$store.dispatch(`${this.namespace}/fetchItems`, true)
    }
  }
}
</script>

<style lang="css" scoped>
.g3-checkbox {
  transform: scale(1.5, 1.5);
  padding-bottom: 5px;
}
.textbox-cancel {
  width: 33px;
  padding-left: 6px;
}
.select-cancel {
  margin-left: -50px;
  z-index: 999;
}
</style>