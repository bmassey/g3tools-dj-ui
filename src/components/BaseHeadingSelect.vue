<template>
  <div class="action-container">
    <!-- Heading checkbox -->
    <div class="p-0 action-check" @click="checkClicked">
      <i
        class="fa fa-check action-checkbox pl-0"
        :class="[selected ? 'row-checked' : 'row-unchecked']"
      />
    </div>
    <!-- Dropdown action button -->
    <div class="dropdown pl-1 action-dropdown">
      <button
        id="topAction"
        class="btn btn-transparent dropdown-toggle fa fas fa-angle-down"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      ></button>
      <div class="dropdown-menu" aria-labelledby="topAction">
        <button
          class="dropdown-item"
          type="button"
          :disabled="selected"
          @click="actionClicked('select-all')"
        >
          Select All
        </button>
        <button
          class="dropdown-item"
          type="button"
          :disabled="!selected"
          @click="actionClicked('un-select-all')"
        >
          Unselect All
        </button>
        <div class="dropdown-divider" type="button"></div>
        <button
          class="dropdown-item"
          type="button"
          :disabled="!selected"
          @click="actionClicked('change-active')"
        >
          Change Selected to Active
        </button>
        <button
          class="dropdown-item"
          type="button"
          :disabled="!selected"
          @click="actionClicked('change-inactive')"
        >
          Change Selected to Inactive
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import "../app.css";
export default {
  props: { selected: { type: Boolean, default: false } },
  data() {
    return {
      //: this.selected,
    };
  },
  methods: {
    checkClicked() {
      if (this.selected) {
        // At least one row is selected: Clear all
        //this.isChecked = false;
        this.$emit("heading-select-changed", false);
      } else {
        // Nothing is selected: Select all
        //this.isChecked = true;
        this.$emit("heading-select-changed", true);
      }
    },
    actionClicked(action) {
      if (action === "select-all") this.isChecked = true;
      else if (action === "unselect-all") this.isChecked = false;
      this.$emit("heading-action", action);
    },
  },
};
</script>

<style lang="css" scoped>
.action-container {
  display: flex;
  justify-content: start;
  margin-bottom: -7px;
}
.action-checkbox {
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
  color: rgb(156, 156, 156);
}
.action-check {
  width: 34px;
  margin-left: 5px;
}
.action-dropdown {
  padding: 0px;
  margin-left: -15px;
  margin-right: 20px;
}
.dropdown-toggle::after {
  display: none;
}
</style>