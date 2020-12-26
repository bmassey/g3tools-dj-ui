<template>
  <div class="container" style="margin-top: 120px">
    <b-form @submit="onSubmit">
      <!-- Main form card -->
      <b-card
        class="shadow-sm brand-item-card"
        :class="{ 'new-item-card': item === 'new' }"
        header-tag="header"
        footer-tag="footer"
      >
        <!-- Header -->
        <template #header>
          <h4 class="mb-0">
            {{ item === "new" ? "New Brand Item" : "Brand Item" }}
          </h4>
        </template>
        <!-- Card body slot -->
        <template>
          <div class="row">
            <div class="" :class="item === 'new' ? 'col-sm-12' : 'col-sm-6'">
              <!-- Brand name -->
              <b-form-group
                id="input-group-brand-name"
                label="Brand name:"
                label-for="input-brand-name"
                description="Enter a unique brand name."
              >
                <b-form-input
                  id="inputBrandName"
                  ref="inputBrandName"
                  v-model="form.brandName"
                  type="text"
                  placeholder=""
                  autocomplete="off"
                  autofocus
                  required
                ></b-form-input>
              </b-form-group>
              <!-- Brand prefix -->
              <b-form-group
                id="input-group-prefix"
                label="Prefix:"
                label-for="input-prefix"
                description="Enter a unique, three-character prefix."
              >
                <b-form-input
                  id="input-prefix"
                  v-model="form.prefix"
                  type="text"
                  placeholder=""
                  autocomplete="off"
                  required
                ></b-form-input>
                <b-form-invalid-feedback id="input-prefix-live-feedback">{{
                  veeErrors.first("input-prefix")
                }}</b-form-invalid-feedback>
              </b-form-group>
              <!-- Brand vendor -->
              <b-form-group
                id="input-group-vendor"
                label="Vendor:"
                label-for="input-vendor"
                description="Enter vendor for this brand."
              >
                <b-form-input
                  id="input-vendor"
                  v-model="form.vendor"
                  type="text"
                  placeholder=""
                  autocomplete="off"
                  required
                ></b-form-input>
              </b-form-group>
              <!-- Active -->
              <b-form-group id="input-group-active" label-for="switch-active">
                <b-form-checkbox
                  v-model="form.active"
                  name="switch-active"
                  switch
                >
                  Active
                </b-form-checkbox>
              </b-form-group>
            </div>
            <!-- Information card -->
            <div v-show="item !== 'new'" class="col-sm-6">
              <b-card>
                <h5 class="info-card-header">Information</h5>
                <hr />
                <div class="row">
                  <div class="col-sm-5 text-right info-label">Id:</div>
                  <div class="col-sm-7 pl-0">{{ item.id }}</div>
                </div>
                <div class="row">
                  <div class="col-sm-5 text-right info-label">Created on:</div>
                  <div class="col-sm-7 pl-0">
                    {{ formatDate(item.createdOn) }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-5 text-right info-label">by:</div>
                  <div class="col-sm-7 pl-0">{{ item.createdBy }}</div>
                </div>
                <div class="row">
                  <div class="col-sm-5 text-right info-label">Modified on:</div>
                  <div class="col-sm-7 pl-0">
                    {{ formatDate(item.modifiedOn) }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-5 text-right info-label">by:</div>
                  <div class="col-sm-7 pl-0">{{ item.modifiedBy }}</div>
                </div>
              </b-card>
            </div>
          </div>
        </template>
        <!-- Footer slot -->
        <template #footer>
          <div class="d-flex justify-content-end">
            <b-button class="mx-3" variant="secondary" @click="onCancel"
              >Cancel</b-button
            >
            <b-button type="submit" variant="primary">Save Changes</b-button>
          </div>
        </template>
      </b-card>
    </b-form>
  </div>
</template>

<script>
import date from "date-and-time";

export default {
  name: "BrandItem",
  props: { item: { type: Object, default: null } },
  data() {
    return {
      form: {
        brandName: this.item.brandName || "",
        prefix: this.item.abbreviation || "",
        vendor: this.item.vendorName || "",
        active: this.active || true,
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    formatDate: function (rawDate) {
      return date.format(new Date(rawDate), "MM/DD/YYYY h:mm A");
    },
    onSubmit: function () {
      // Save record
      //this.$router.go(-2);
      this.$router.push({ path: `/brand-list` });
    },
    onCancel: function () {
      // Handle # at end of url
      //this.$router.go(-2);
      this.$router.push({ path: `/brand-list` });
    },
  },
};
</script>

<style lang="css" scoped>
.brand-item-card {
  width: 45em;
  margin: 0 auto;
}
.new-item-card {
  width: 25em;
  margin: 0 auto;
}
.info-label {
  color: grey;
}
.info-card-header {
  margin-top: -12px;
  margin-bottom: -10px;
}
</style>