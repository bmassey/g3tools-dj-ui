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
                <!-- Item Number -->
                <BaseFormInput
                  id="item-number"
                  label="Item number:"
                  v-model="form.itemNumber"
                  description="Enter an existing item number"
                  autofocus
                  :error="$v.form.itemNumber.$error"
                  errorMsg="Item number is required and must exist in item master"
                  :state="validateState('itemNumber')"
                  @blur="$v.form.itemNumber.$touch()"
                />
                <!-- Brand name -->
                <BaseFormInput
                  id="brand-name"
                  label="Brand name:"
                  v-model="form.brandName"
                  description="Enter an existing brand name"
                  :error="$v.form.brandName.$error"
                  errorMsg="Brand name is required"
                  :state="validateState('brandName')"
                  @blur="$v.form.brandName.$touch()"
                />
                <!-- Item description -->
                <BaseFormInput
                  id="description"
                  label="Description:"
                  v-model="form.productDescription"
                  description="Enter item description (optional)"
                  :error="false"
                  errorMsg=""
                  :state="null"
                />
                <!-- Restricted Reason -->
                <BaseFormInput
                  id="restricted-reason"
                  label="Reason:"
                  v-model="form.restrictedReason"
                  description="Enter the reason for restriction"
                  :error="$v.form.restrictedReason.$error"
                  errorMsg="Restricted reason is required"
                  :state="validateState('restrictedReason')"
                  @blur="$v.form.restrictedReason.$touch()"
                />
                <!-- Enabled -->
                <b-form-group id="cb-group-active" label-for="cb-active">
                  <b-form-checkbox
                    v-model="form.enabled"
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
            <!-- Notes -->
            <BaseFormTextarea
              id="notes"
              label="Notes:"
              v-model="form.notes"
              description="Enter notes (shift-enter for new line)."
              :error="false"
              errorMsg=""
              :state="null"
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
import { required } from 'vuelidate/lib/validators'

export default {
  components: {},
  name: 'RestrictedItem',
  props: {
    id: { default: -1 },
    namespace: { type: String, default: 'Restricted' },
    mode: { type: String, default: 'new' }
  },
  data() {
    return {
      form: {}
    }
  },
  validations: {
    form: {
      itemNumber: { required },
      brandName: { required },
      restrictedReason: { required }
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
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },

    createFreshForm() {
      return {
        id: '',
        brandName: '',
        itemNumber: '',
        productDescription: '',
        restrictedReason: '',
        notes: '',
        enabled: true,
        insertDate: '',
        ts: ''
      }
    },
    setFormFromStore() {
      return {
        id: this.state.item.id,
        brandName: this.state.item.brandName,
        itemNumber: this.state.item.itemNumber,
        productDescription: this.state.item.productDescription,
        restrictedReason: this.state.item.restrictedReason,
        notes: this.state.item.notes,
        enabled: this.state.item.enabled,
        insertDate: this.state.item.insertDate,
        ts: this.state.item.ts
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
            name: 'restricted-list',
            params: { force: force, sort: 'ts' }
          })
        } catch (error) {
          console.log(error)
        }
      }
    },
    onCancel() {
      // Push to list so we don't refresh
      this.$router.push({
        name: 'restricted-list',
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
