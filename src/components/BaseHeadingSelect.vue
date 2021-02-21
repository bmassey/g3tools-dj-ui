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
    <!-- <b-dropdown id="topAction" no-caret class="dd-button" variant="link">
      <template #button-content>
        <b-icon icon="caret-down" class="top-dd" variant="secondary" />
      </template>
      <b-dropdown-item-btn
        :disabled="selected"
        @click="headingAction('select-all')"
      >
        Select All
      </b-dropdown-item-btn>
      <b-dd-item-btn
        :disabled="!selected"
        @click="headingAction('un-select-all')"
      >
        Unselect All
      </b-dd-item-btn>
    </b-dropdown> -->
  </div>
</template>

<script>
import '../app.css'
import _ from 'lodash'

export default {
  props: { namespace: { type: String, default: '' } },
  data() {
    return {
      //: this.selected,
    }
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    },
    selected() {
      return this.state.selectedItems.length > 0
    }
  },
  methods: {
    checkClicked() {
      if (this.selected) {
        // At least one row is selected: Clear all
        this.headingSelectChanged(false)
      } else {
        // Nothing is selected: Select all
        this.headingSelectChanged(true)
      }
    },
    headingAction: async function (action) {
      switch (action) {
        case 'select-all':
          this.headingSelectChanged(true)
          break
        case 'un-select-all':
          this.headingSelectChanged(false)
          break
      }
    },
    headingSelectChanged: function (checked) {
      // If checked, select all rows
      this.$store.dispatch(
        `${this.namespace}/selectedItemsSet`,
        checked ? _.map(this.state.items, 'id') : []
      )
    }
  }
}
</script>

<style lang="css" scoped>
.action-container {
  margin-bottom: -7px;
}
.action-checkbox {
  height: 34px;
  padding-top: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.action-checkbox:hover {
  transform: scale(1.2, 1.2);
}
.top-dd {
  transform: scale(0.8, 0.8);
}
d-button,
.dd-button {
  margin-left: -16px;
  background-color: transparent;
}
.row-checked {
  color: #007bff;
}
.row-unchecked {
  color: rgb(156, 156, 156);
}
.action-check {
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
}
b-button:checked {
  background-color: red;
  appearance: none;
}
::v-deep > button:hover {
  background-color: rgb(199, 199, 199);
}
::v-deep > b-dropdown:focus {
  background-color: transparent;
}
::v-deep > .btn-secondary.dropdown-toggle:active {
  background-color: grey;
}
</style>