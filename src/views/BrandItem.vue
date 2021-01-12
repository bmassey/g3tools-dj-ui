<template>
  <div class="container" style="margin-top: 120px">
    <b-form @submit.prevent="onSubmit">
      <!-- Main form card -->
      <b-card
        class="shadow-sm brand-item-card"
        :class="{ 'new-item-card': mode === 'new' }"
        header-tag="header"
        footer-tag="footer"
      >
        <!-- <pulse-loader
          class="loading"
          :loading="state.dataLoading"
        ></pulse-loader> -->

        <!-- Header -->
        <template #header>
          <span style="display: flex; justify-content: space-between">
            <h4 class="mb-0">
              {{ mode === 'new' ? 'New Brand Item' : 'Brand Item' }}
            </h4>
            <!-- Spinner by refresh button -->
            <b-spinner
              class="loading-spinner"
              v-if="state.dataLoading"
              variant="primary"
              type="grow"
            ></b-spinner>
          </span>
        </template>

        <!-- Card body slot -->
        <template>
          <div class="row">
            <div class="" :class="mode === 'new' ? 'col-sm-12' : 'col-sm-6'">
              <!-- Brand name -->
              <b-form-group
                id="input-group-brand-name"
                label="Brand name:"
                label-for="input-brand-name"
                description="Enter a unique brand name."
              >
                <b-form-input
                  id="input-brand-name"
                  ref="input-brand-name"
                  v-model="brand.brandName"
                  type="text"
                  :disabled="state.dataLoading"
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
                  v-model="brand.abbreviation"
                  type="text"
                  :disabled="state.dataLoading"
                  placeholder=""
                  autocomplete="off"
                  required
                ></b-form-input>
                <b-form-invalid-feedback id="input-prefix-live-feedback">{{
                  veeErrors.first('input-prefix')
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
                  v-model="brand.vendorName"
                  type="text"
                  placeholder=""
                  :disabled="state.dataLoading"
                  autocomplete="off"
                  required
                ></b-form-input>
              </b-form-group>
              <!-- Active -->
              <b-form-group id="test2" label-for="test3">
                <b-form-checkbox
                  v-model="brand.active"
                  name="test3"
                  switch
                  :disabled="state.dataLoading"
                >
                  Active
                </b-form-checkbox>
              </b-form-group>
            </div>
            <!-- Info and History -->
            <div v-show="mode !== 'new'" class="col-sm-6">
              <BaseInformationCard :info="brand" />
              <BaseHistoryCard :item="brand" />
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
              v-model="brand.description"
              type="textarea"
              placeholder=""
              :disabled="state.dataLoading"
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
            <b-button
              type="submit"
              variant="primary"
              :disabled="state.dataLoading"
              >Save Changes</b-button
            >
          </div>
        </template>
      </b-card>
    </b-form>
  </div>
</template>

<script>
// import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import config from '../../config'

export default {
  components: {
    // PulseLoader
  },
  name: 'BrandItem',
  props: {
    // id: { type: Number, default: -1 },
    id: { default: -1 },
    namespace: { type: String, default: 'Brand' },
    mode: { type: String, default: 'new' }
  },
  data() {
    return {
      brand: {}
    }
  },
  async created() {
    // Get record if not new
    if (this.mode !== 'new') {
      // Retrieve item if config says so
      this.brand = this.setBrandFromStore()
      if (config.fetchDetailItemFromDb)
        await this.$store.dispatch(`${this.namespace}/fetchItem`, this.id)
      this.brand = this.setBrandFromStore()
    } else {
      // Initialize a blank object
      this.brand = this.createFreshBrand()
    }
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    }
  },
  mounted() {
    //this.$refs.inputBrandName.focus
  },
  methods: {
    // async fetchItem() {
    //   await this.$store.dispatch(`${this.namespace}/fetchItem`, this.id)
    // },
    createFreshBrand() {
      return {
        brandName: '',
        abbreviation: '',
        vendorName: '',
        active: true,
        description: '',
        id: '',
        createdOn: '',
        createdBy: '',
        modifiedOn: '',
        modifiedBy: ''
      }
    },
    setBrandFromStore() {
      return {
        brandName: this.state.item.brandName,
        abbreviation: this.state.item.abbreviation,
        vendorName: this.state.item.vendorName,
        active: this.state.item.active,
        description: this.state.item.description,
        id: this.state.item.id,
        createdOn: this.state.item.createdOn,
        createdBy: this.state.item.createdBy,
        modifiedOn: this.state.item.modifiedOn,
        modifiedBy: this.state.item.modifiedBy
      }
    },
    async onSubmit() {
      if (this.mode === 'new') await this.createBrand()
      else await this.saveBrand()
      this.$router.push({
        name: 'brand-list',
        params: { force: true, sort: 'modifiedOn' }
      })
    },
    onCancel() {
      // Push to list so we don't refresh
      this.$router.push({
        name: 'brand-list',
        params: { force: false }
      })
      //      this.$router.go(-2)
    },
    async createBrand() {
      await this.$store.dispatch(`${this.namespace}/itemCreate`, this.brand)
    },
    async saveBrand() {
      await this.$store.dispatch(`${this.namespace}/itemSave`, {
        item: this.brand,
        postToast: true
      })
    }
  }
}
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
