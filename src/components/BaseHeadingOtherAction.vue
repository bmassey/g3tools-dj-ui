<template>
  <div>
    <b-dropdown
      class="kabab-button"
      right
      size="sm"
      variant="link"
      toggle-class="text-decoration-none"
      no-caret
    >
      <template #button-content>
        <div class="kabab" />
        <span class="sr-only">Search</span>
      </template>
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
      <b-dd-divider></b-dd-divider>
      <b-dd-item-btn
        :disabled="!selected"
        @click="actionClicked('delete-selected')"
      >
        Delete Selected
      </b-dd-item-btn>
    </b-dropdown>
    <b-modal id="confirm-delete" title="Confirm Delete">
      <p class="my-4">
        Are you sure you want to delete these
        {{ state.selectedItems.length }} selected items?
      </p>
    </b-modal>
  </div>
</template>

<script>
// import '../app.css'
import _ from 'lodash'
import Vue from 'vue'
import VueToast from 'vue-toast-notification'
// Import one of the available themes
// import 'vue-toast-notification/dist/theme-default.css'
// import 'vue-toast-notification/dist/theme-sugar.css'

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
    actionClicked: async function (action) {
      let i = 0
      switch (action) {
        case 'delete-selected':
          // Confirm delete
          this.$bvModal
            .msgBoxConfirm(
              `Are you sure you want to delete these ${
                this.state.selectedItems.length > 1 ? 'these' : 'this'
              } ${this.state.selectedItems.length} selected items?`,
              { okVariant: 'danger' }
            )
            .then(async (confirm) => {
              if (confirm) {
                await this.$store.dispatch(
                  `${this.namespace}/deleteSelectedItems`
                )
              }
            })
          break
        // Active/inactive
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
            this.$store.dispatch('Notification/toastMsgAdd', msg, {
              root: true
            })
          } catch (err) {
            const msg = `Error saving record: ${err}`
            this.$store.dispatch('Notification/toastErrorAdd', msg, {
              root: true
            })
          }
          break
      }
    }
  }
}
</script>

<style lang="css" scoped>
.kabab {
  margin-top: -12px;
  margin-left: -5px;
  margin-right: -15px;
  padding-top: 5px;
  color: #333;
  transition: 0.2s;
}
.kabab:after {
  content: '\2807';
  font-size: 25px;
}
.kabab:hover {
  transform: scale(1.1, 1.1);
}
.kabab-button {
  height: 35px;
  width: 25px;
  margin-right: -5px;
  margin-top: 5px;
}
</style>
