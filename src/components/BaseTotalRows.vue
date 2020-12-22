<template>
  <div>
    <label v-if="noResultsMsg !== ''">{{ noResultsMsg }}</label>
    <label v-else-if="useShowing >= totalRows"
      >Showing all <strong>{{ totalRows }}</strong> rows</label
    >
    <label v-else
      >Showing <strong>{{ useShowing }}</strong> of
      <strong>{{ this.totalRows }}</strong> rows</label
    >
  </div>
</template>

<script>
export default {
  props: {
    showing: Number,
    totalRows: Number,
    noResultsMsg: String,
  },
  data() {
    return {}
  },
  computed: {
    useShowing: function() {
      return this.totalRows < this.showing ? this.totalRows : this.showing
    },
  },
}
</script>

<style lang="css" scoped></style>
