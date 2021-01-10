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
import '../app.css'
import _ from 'lodash'
import Vue from 'vue'
import VueToast from 'vue-toast-notification'
// Import one of the available themes
import 'vue-toast-notification/dist/theme-default.css'
import 'vue-toast-notification/dist/theme-sugar.css'

Vue.use(VueToast)

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
    async actionClicked(action) {
      if (action === 'select-all') this.isChecked = true
      else if (action === 'unselect-all') this.isChecked = false
      await this.headingAction(action)
    },
    headingSelectChanged: function (checked) {
      // If checked, select all rows
      this.$store.dispatch(
        `${this.namespace}/selectedItemsSet`,
        checked ? _.map(this.state.items, 'id') : []
      )
    },
    headingAction: async function (action) {
      let i = 0
      switch (action) {
        case 'select-all':
          this.headingSelectChanged(true)
          break
        case 'un-select-all':
          this.headingSelectChanged(false)
          break
        default:
          try {
            // Change records to active / inactive
            const promises = this.state.selectedItems.map(async (itemId) => {
              // Change item active status in items list and save
              const foundItem = _.find(this.state.items, { id: itemId })
              let clonedItem = _.cloneDeep(foundItem)
              clonedItem.active = action === 'change-active' ? true : false
              // Save to list and database
              await this.$store.dispatch(`${this.namespace}/itemSave`, {
                item: clonedItem,
                postToast: false
              })
              i++
              return
            })
            await Promise.all(promises)
            // Success: Tell user
            const msg = `Successfully changed ${
              i >= 200 ? 'maximum of 200' : i
            } records`
            Vue.$toast.open({
              message: msg,
              type: 'success',
              duration: 7000
            })
          } catch (err) {
            console.error(`Error saving record: ${err}`)
            Vue.$toast.open({
              message: `Error saving record: ${err}`,
              type: 'danger',
              duration: 7000
            })
          }
          break
      }
    }
  }
}
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