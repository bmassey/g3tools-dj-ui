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
    buttons: Array
  },
  data() {
    return {
      valueOption: "active"
    }
  },
  computed: {
    buttonsLocal() {
      return this.buttons
    }
  },
  methods: {
    buttonClass: function(isActive) {
      return isActive ? "active btn-secondary" : "btn-outline-secondary"
    },
    checkChanged() {
      console.log("checkChanged: ", this.valueOption)
      this.$emit("change-option", this.valueOption)
    }
  }
}
</script>

<style lang="scss" scoped></style>
