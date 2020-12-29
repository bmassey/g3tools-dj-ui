<template>
  <div class="action-container">
    <!-- Heading checkbox -->
    <div class="action-check" @click="checkClicked">
      <i
        class="fa fa-check action-checkbox"
        :class="[selected ? 'row-checked' : 'row-unchecked']"
      />
    </div>
    <!-- Dropdown action button -->
    <b-dropdown id="topAction" no-caret>
      <template #button-content>
        <b-icon icon="caret-down" variant="secondary" />
      </template>
      <b-dropdown-item-btn
        :disabled="selected"
        @click="actionClicked('select-all')"
      >
        Select All
      </b-dropdown-item-btn>
      <b-dd-item-btn
        :disabled="!selected"
        @click="actionClicked('un-select-all')"
      >
        Unselect All
      </b-dd-item-btn>
      <b-dd-divider></b-dd-divider>
      <b-dd-item-btn
        :disabled="!selected"
        @click="actionClicked('change-active')"
      >
        Change Selected to Active
      </b-dd-item-btn>
      <b-dd-item-btn
        :disabled="!selected"
        @click="actionClicked('change-inactive')"
      >
        Change Selected to Inactive
      </b-dd-item-btn>
    </b-dropdown>
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
  padding-top: 8px;
  padding-right: 10px;
  cursor: pointer;
  transition: 0.2s;
}
.action-checkbox:hover {
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
::v-deep > button {
  background-color: transparent;
  border: none;
  padding-right: 5px;
  padding-left: 5px;
  padding-bottom: 0px;
  margin-bottom: 5px;
  margin-right: 20px;
  /* margin-left: -10px; */
}
::v-deep > button:hover {
  background-color: rgb(199, 199, 199);
}
::v-deep > b-dropdown:active {
  background-color: transparent;
}
::v-deep > .btn-secondary.dropdown-toggle:active {
  background-color: grey;
}
</style>