<template>
  <div>
    <b-form-group
      :id="id"
      :label="label"
      :label-for="`${id}-input`"
      :description="error ? '' : description"
      class="label"
      :class="{ 'form-group--error': error }"
    >
      <b-form-input
        v-if="uppercase"
        :id="`${id}-input`"
        :name="`${id}-input`"
        :type="type"
        :value="value"
        v-bind="$attrs"
        autocomplete="off"
        v-uppercase
        :state="state"
        :aria-describedby="`${id}-live-feedback`"
        v-on="$listeners"
      ></b-form-input>
      <b-form-input
        v-if="!uppercase"
        :id="`${id}-input`"
        :name="`${id}-input`"
        :type="type"
        :value="value"
        v-bind="$attrs"
        autocomplete="off"
        :state="state"
        :aria-describedby="`${id}-live-feedback`"
        v-on="$listeners"
      ></b-form-input>
      <b-form-invalid-feedback id="test-live-feedback">{{
        errorMsg
      }}</b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    id: { type: String },
    description: { type: String },
    label: { type: String, default: '' },
    type: { type: String, default: 'text' },
    value: [String, Number],
    state: [Boolean, null],
    error: { type: Boolean },
    errorMsg: { type: String },
    uppercase: { type: Boolean, default: false }
  },
  methods: {
    // updateValue(event) {
    //   this.$emit('input', event.target.value)
    // }
  }
}
</script>

<style lang="css" scoped>
</style>
