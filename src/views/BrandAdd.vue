<template>
  <div>
    <b-modal id="add-modal" title="Add Brand" ok-title="Save">
      <template #default>
        <b-form @submit="onSubmit" @reset="onReset">
          <!-- Brand name -->
          <b-form-group
            id="input-group-brand-name"
            label="Brand name:"
            label-cols-sm="3"
            label-align="right"
            label-for="input-brand-name"
            description="Enter a unique brand name."
          >
            <b-form-input
              id="inputBrandName"
              ref="inputBrandName"
              v-model="form.brandName"
              type="text"
              placeholder=""
              autofocus
              required
            ></b-form-input>
          </b-form-group>
          <!-- Brand prefix -->
          <b-form-group
            id="input-group-prefix"
            label="Prefix:"
            label-cols-sm="3"
            label-align="right"
            label-for="input-prefix"
            description="Enter a unique, three-character prefix."
          >
            <b-form-input
              id="input-prefix"
              v-model="form.prefix"
              type="text"
              placeholder=""
              required
            ></b-form-input>
          </b-form-group>
          <!-- Brand vendor -->
          <b-form-group
            id="input-group-vendor"
            label="Vendor:"
            label-cols-sm="3"
            label-align="right"
            label-for="input-vendor"
            description="Enter vendor for this brand."
          >
            <b-form-input
              id="input-vendor"
              v-model="form.vendor"
              type="text"
              placeholder=""
              required
            ></b-form-input>
          </b-form-group>
          <!-- Active -->
          <b-form-group
            id="input-group-active"
            label-cols-sm="3"
            label-align="right"
            label-for="switch-active"
          >
            <b-form-checkbox v-model="form.active" name="switch-active" switch>
              Active
            </b-form-checkbox>
          </b-form-group>
        </b-form>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        brandName: "",
        prefix: "",
        vendor: "",
        active: true,
      },
    };
  },
  watch: {},
  methods: {
    onSubmit: function () {
      console.log("onsubmit");
    },
    onReset: function () {
      console.log("onreset");
    },
  },
};
</script>

<style lang="css" scoped>
</style>