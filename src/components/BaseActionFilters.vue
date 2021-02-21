<template>
  <div>
    <template v-for="group in actionFilters">
      <!-- Basic filter 3 buttons -->
      <div class="btn-group btn-group-toggle ml-2" :key="group.dbName">
        <template v-for="item in group.buttons">
          <label
            :key="item.btnName"
            class="btn btn-outline-secondary"
            :class="{ active: groupValue(group.dbName) === item.value }"
          >
            <input
              type="radio"
              name="options"
              :id="item.btnName"
              autocomplete="off"
              :defaultValue="item.value === group.defaultValue ? true : false"
              :value="item.value"
              @change="checkChanged($event, group.dbName)"
            />
            {{ item.btnLabel }}
          </label>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    namespace: { type: String, default: '' }
  },
  computed: {
    actionFilters() {
      return this.state.actionFilters
    },
    state() {
      return this.$store.state[this.namespace]
    }
  },
  methods: {
    groupValue(fieldName) {
      var foundGroup = this.actionFilters.find((x) => x.dbName === fieldName)
      return foundGroup.selectedValue
    },
    buttonClass: function (isActive) {
      return isActive ? 'active btn-secondary' : 'btn-outline-secondary'
    },
    async checkChanged(event, group) {
      // Set action filter for this button group
      this.$store.commit(`${this.namespace}/ACTION_FILTER_SELECTED`, {
        fieldName: group,
        fieldValue: event.target.value
      })
      // Apply filter and fetch items
      await this.$store.dispatch(`${this.namespace}/filterApply`)
      await this.$store.dispatch(`${this.namespace}/fetchItems`, true)
    }
  }
}
</script>

<style lang="scss" scoped></style>
