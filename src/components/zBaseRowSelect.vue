<template>
  <!-- Row select -->
  <span class="p-0 flex-fill" @click="rowSelected(item.id)">
    <i
      class="fa fa-check row-select"
      :class="[isRowChecked(item.id) ? 'row-checked' : 'row-unchecked']"
    />
  </span>
</template>

<script>
import utils from "../utils/jsUtils.js";

export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      selectedItems: [],
    };
  },
  methods: {
    rowSelected: function (id) {
      utils.arrToggle(this.selectedItems, id);
    },
    isRowChecked: function (id) {
      // Is this id in the selectedItems array?
      return this.selectedItems.indexOf(id) !== -1;
    },
  },
};
</script>

<style lang="css" scoped>
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
  transform: scale(1.3, 1.3);
}
.row-checked {
  color: #007bff;
}
.row-unchecked {
  color: rgb(200, 200, 200);
}
</style>