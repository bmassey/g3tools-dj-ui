<template>
  <div class="d-flex">
    <label v-if="noResultsMsg !== ''">{{ noResultsMsg }}</label>
    <label v-else-if="useShowing >= totalRows"
      >Showing all <strong>{{ totalRows }}</strong> rows</label
    >
    <label v-else
      >Showing <strong>{{ useShowing }}</strong> of
      <strong>{{ totalRows }}</strong> rows</label
    >
    <label v-show="selected > 0" class="ml-3 text-secondary">
      <i
        ><strong>{{ selected }}</strong> selected</i
      >
    </label>
  </div>
</template>

<script>
export default {
  props: {
    showing: { type: Number, default: 0 },
    totalRows: { type: Number, default: 0 },
    noResultsMsg: { type: String, default: "" },
    selected: { type: Number, default: 0 },
  },
  data() {
    return {};
  },
  computed: {
    useShowing: function () {
      return this.totalRows < this.showing ? this.totalRows : this.showing;
    },
  },
};
</script>

<style lang="css" scoped></style>
