<template>
  <div class="d-flex">
    <label v-if="state.totalRows === 0">{{ noResultsMsg }}</label>
    <label v-else-if="useShowing >= state.totalRows"
      >Showing all <strong>{{ state.totalRows }}</strong> rows</label
    >
    <label v-else
      >Showing <strong>{{ useShowing }}</strong> of
      <strong>{{ state.totalRows }}</strong> rows</label
    >
    <label v-show="state.selectedItems.length > 0" class="ml-3 text-secondary">
      <i
        ><strong>{{ state.selectedItems.length }}</strong> selected</i
      >
    </label>
  </div>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  props: {
    namespace: { type: String, default: '' }
  },
  data() {
    return {
      noResultsMsg: 'No results'
    }
  },
  computed: {
    useShowing: function () {
      return this.state.totalRows < this.state.pageSize
        ? this.state.totalRows
        : this.state.pageSize
    },
    state() {
      return this.$store.state[this.namespace]
    }
  }
}
</script>

<style lang="css" scoped></style>
