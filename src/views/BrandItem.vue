<template>
  <div class="container" style="margin-top: 120px">
    <b-form @submit="onSubmit">
      <!-- Main form card -->
      <b-card
        class="shadow-sm brand-item-card"
        :class="{ 'new-item-card': status === 'new' }"
        header-tag="header"
        footer-tag="footer"
      >
        <!-- Header -->
        <template #header>
          <h4 class="mb-0">
            {{ status === "new" ? "New Brand Item" : "Brand Item" }}
          </h4>
        </template>
        <!-- Card body slot -->
        <template>
          <div class="row">
            <div class="" :class="status === 'new' ? 'col-sm-12' : 'col-sm-6'">
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
                  v-model="form.abbreviation"
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
                  v-model="form.vendorName"
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
            <div v-show="status !== 'new'" class="col-sm-6">
              <BaseInformationCard :info="info" />
              <BaseHistoryCard :item="item" />
            </div>
          </div>
          <!-- Description/Notes -->
          <b-form-group
            id="input-group-notes"
            label="Notes:"
            label-for="input-notes"
            description="Enter description or notes."
          >
            <b-form-textarea
              id="input-mptes"
              v-model="form.description"
              type="textarea"
              placeholder=""
              autocomplete="off"
            ></b-form-textarea>
          </b-form-group>
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
export default {
  name: "BrandItem",
  props: {
    item: { type: Object, default: null },
    status: { type: String, default: "new" },
  },
  data() {
    return {
      form: {
        brandName: this.item.brandName || "",
        abbreviation: this.item.abbreviation || "",
        vendorName: this.item.vendorName || "",
        active: this.item.active || true,
        description: this.item.description || "",
        id: this.item.id || "",
      },
      info: {
        id: this.item.id || "",
        createdOn: this.item.createdOn || "",
        createdBy: this.item.createdBy || "",
        modifiedOn: this.item.modifiedOn || "",
        modifiedBy: this.item.modifiedBy || "",
      },
    };
  },
  computed: {},
  watch: {
    item: function (newValue) {
      this.refreshData(newValue);
    },
  },
  mounted() {
    // this.test();
  },
  methods: {
    refreshData: function (newValue) {
      if (newValue === null || this.status === "new") {
        this.form.brandName = "";
        this.form.abbreviation = "";
        this.form.vendorName = "";
        this.form.active = true;
        this.form.description = "";
        this.form.id = "";
        this.info.id = "";
        this.info.createdOn = "";
        this.info.createdBy = "";
        this.info.modifiedOn = "";
        this.info.modifiedBy = "";
      } else {
        this.form.brandName = newValue.brandName;
        this.form.abbreviation = newValue.abbreviation;
        this.form.vendorName = newValue.vendorName;
        this.form.active = newValue.active;
        this.form.description = newValue.description;
        this.form.id = newValue.id;
        this.info.id = newValue.id;
        this.info.createdOn = newValue.createdOn;
        this.info.createdBy = newValue.createdBy;
        this.info.modifiedOn = newValue.modifiedOn;
        this.info.modifiedBy = newValue.modifiedBy;
      }
      this.$refs.inputBrandName.focus;
    },
    // test: function () {
    //   console.log("test", this.description);
    // },
    onSubmit: function () {
      // Save record
      //this.$router.go(-2);
      // this.$router.push({ path: `/brand-list` });
      this.$emit("item-closed", this.form);
    },
    onCancel: function () {
      // Handle # at end of url
      this.$emit("item-closed", "cancel");
      //this.$router.go(-2);
      // this.$router.push({ path: `/brand-list` });
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
</style>