<template>
  <div>
    <!-- Basic filter 3 buttons -->
    <div class="btn-group btn-group-toggle ml-2">
      <template v-for="item in buttonsLocal">
        <label
          :key="item.btnName"
          class="btn btn-outline-secondary"
          :class="{ active: valueOption === item.value }"
        >
          <input
            type="radio"
            name="options"
            :id="item.btnName"
            autocomplete="off"
            v-model="valueOption"
            :value="item.value"
            @change="checkChanged"
          />
          {{ item.btnLabel }}
        </label>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    namespace: { type: String, default: '' }
  },
  data() {
    return {
      valueOption: 'active'
    }
  },
  computed: {
    buttonsLocal() {
      return this.state.activeFilterButtons
    },
    state() {
      return this.$store.state[this.namespace]
    }
  },
  methods: {
    buttonClass: function (isActive) {
      return isActive ? 'active btn-secondary' : 'btn-outline-secondary'
    },
    checkChanged() {
      this.$store.dispatch(`${this.namespace}/filterActive`, this.valueOption)
    }
  }
}
</script>

<style lang="scss" scoped></style>
