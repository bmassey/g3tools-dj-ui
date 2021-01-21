<template>
  <b-overlay :show="state.dataLoading" :opacity="0.5">
    <div class="container" style="margin-top: 120px">
      <BaseAlert :mode="mode" />
      <b-form
        @submit.prevent="onSubmit"
        @keydown.enter.exact="onSubmit"
        @keydown.esc.exact="onCancel"
      >
        <!-- Main form card -->
        <b-card
          class="shadow-sm item-card"
          :class="{ 'item-card-new': mode === 'new' }"
          header-tag="header"
          footer-tag="footer"
        >
          <!-- Header -->
          <template #header>
            <span style="display: flex; justify-content: space-between">
              <h4 class="mb-0">
                {{ mode === 'new' ? 'New Brand Item' : 'Brand Item' }}
              </h4>
            </span>
          </template>

          <!-- Card body slot -->
          <template>
            <div class="row">
              <div class="" :class="mode === 'new' ? 'col-sm-12' : 'col-sm-6'">
                <!-- Brand Name -->
                <BaseFormInput
                  id="brand-name"
                  label="Brand name:"
                  v-model="form.brandName"
                  description="Enter a unique brand name"
                  autofocus
                  :error="$v.form.brandName.$error"
                  errorMsg="Brand name is required and must be unique"
                  :state="validateState('brandName')"
                  @blur="$v.form.brandName.$touch()"
                  @keyup="defaultVendor"
                />
                <!-- Brand prefix -->
                <BaseFormInput
                  id="prefix"
                  label="Prefix:"
                  v-model="form.abbreviation"
                  :uppercase="true"
                  description="Enter a unique, three-character prefix"
                  :error="$v.form.abbreviation.$error"
                  errorMsg="A unique, three-character prefix is required"
                  :state="validateState('abbreviation')"
                  @blur="$v.form.abbreviation.$touch()"
                />
                <!-- Brand vendor -->
                <BaseFormInput
                  id="vendor"
                  label="Vendor:"
                  v-model="form.vendorName"
                  description="Enter this brand's vendor"
                  :error="$v.form.vendorName.$error"
                  errorMsg="Vendor is required"
                  :state="validateState('vendorName')"
                  @blur="$v.form.vendorName.$touch()"
                />
                <!-- Active -->
                <b-form-group id="cb-group-active" label-for="cb-active">
                  <b-form-checkbox
                    v-model="form.active"
                    name="cb-active"
                    switch
                  >
                    Active
                  </b-form-checkbox>
                </b-form-group>
              </div>
              <!-- Info and History -->
              <div v-show="mode !== 'new'" class="col-sm-6">
                <BaseInformationCard :info="form" />
                <BaseHistoryCard :item="form" />
              </div>
            </div>
            <!-- Description/Notes -->
            <BaseFormTextarea
              id="description"
              label="Description:"
              v-model="form.description"
              description="Enter description or notes (shift-enter for new line)."
              :error="false"
              errorMsg=""
              :state="null"
              @blur="$v.form.description.$touch()"
            />
          </template>
          <!-- Footer slot -->
          <template #footer>
            <div class="d-flex justify-content-end">
              <b-button class="mx-3" variant="secondary" @click="onCancel"
                >Cancel</b-button
              >
              <b-button type="submit" variant="primary" :disabled="$v.$invalid"
                >Save Changes</b-button
              >
            </div>
          </template>
        </b-card>
      </b-form>
    </div>
  </b-overlay>
</template>

<script>
import config from '../../config'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  components: {
    // PulseLoader
  },
  name: 'BrandItem',
  props: {
    id: { default: -1 },
    namespace: { type: String, default: 'Brand' },
    mode: { type: String, default: 'new' }
  },
  data() {
    return {
      form: {}
    }
  },
  validations: {
    form: {
      brandName: { required },
      abbreviation: { required, maxLength: maxLength(3) },
      vendorName: { required }
    }
  },
  async created() {
    // Get record if not new
    if (this.mode !== 'new') {
      // Retrieve item if config says so
      this.form = this.setFormFromStore()
      if (config.fetchDetailItemFromDb)
        await this.$store.dispatch(`${this.namespace}/fetchItem`, this.id)
      this.form = this.setFormFromStore()
    } else {
      // Initialize a blank object
      this.form = this.createFreshForm()
    }
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    }
  },
  // filters: {
  //   upperCase: function (value) {
  //     if (!value) return ''
  //     return value.toUpperCase()
  //   }
  // },
  methods: {
    defaultVendor() {
      this.form.vendorName = this.form.brandName
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },

    createFreshForm() {
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
        modifiedBy: '',
        test: '',
        test2: ''
      }
    },
    setFormFromStore() {
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
      // Alert if any validation errors
      this.$v.$touch()
      if (this.$v.$anyError) {
        const msg = 'Please fix errors before saving.'
        this.$store.dispatch('Notification/alertErrorAdd', msg, { root: true })
      }
      if (!this.$v.$invalid) {
        let force = true
        try {
          if (this.mode === 'new') {
            // Create item
            await this.$store.dispatch(
              `${this.namespace}/itemCreate`,
              this.form
            )
            force = true
          } else {
            // Save existing item
            await this.$store.dispatch(`${this.namespace}/itemSave`, {
              item: this.form,
              postToast: true
            })
            force = false
          }
          // Route back to list
          this.$router.push({
            name: 'brand-list',
            params: { force: force, sort: 'modifiedOn' }
          })
        } catch (error) {
          console.log(error)
        }
      }
    },
    onCancel() {
      // Push to list so we don't refresh
      this.$router.push({
        name: 'brand-list',
        params: { force: false }
      })
    }
  }
}
</script>

<style lang="css" scoped>
.item-card {
  width: 45em;
  margin: 0 auto;
}
.item-card-new {
  width: 25em;
  margin: 0 auto;
}
</style>
