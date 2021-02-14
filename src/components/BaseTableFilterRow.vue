<template>
  <tr class="thead-light text-center" v-if="state.showFilterRow">
    <th colspan="2" scope="col" style="width: 10%" />
    <!-- Column headings array from props -->
    <template v-for="field in columns">
      <th
        :key="field.dbName"
        scope="col"
        :style="
          field.headingWidthPct !== -1
            ? { width: `${field.headingWidthPct}%` }
            : ''
        "
      >
        <b-form-select
          v-if="field.filterable && field.filterType === 'select'"
          :options="field.filterOptions"
        />
        <b-input v-if="field.filterable && field.filterType === 'text'" />
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
    namespace: { type: String, default: '' },
    columns: { type: Array }
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    }
  }
}
</script>

<style lang="css" scoped>
.g3-checkbox {
  transform: scale(1.5, 1.5);
  padding-bottom: 5px;
}
</style>