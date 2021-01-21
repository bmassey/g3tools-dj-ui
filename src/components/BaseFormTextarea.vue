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
      <b-form-textarea
        :id="`${id}-input`"
        :name="`${id}-input`"
        :value="value"
        v-bind="$attrs"
        :state="state"
        :aria-describedby="`${id}-live-feedback`"
        v-on="$listeners"
      ></b-form-textarea>
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
    value: [String, Number],
    state: [Boolean, null],
    error: { type: Boolean },
    errorMsg: { type: String }
  },
  methods: {}
}
</script>

<style lang="css" scoped>
</style>
