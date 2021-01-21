<template>
  <b-container
    class="alert-message p-0"
    :class="{ 'alert-new': mode === 'new' }"
  >
    <b-row>
      <b-col align-self="center">
        <b-alert
          v-model="show"
          class="rounded-0"
          style="z-index: 2000"
          :variant="variant"
          dismissible
        >
          {{ alertState.message }}
        </b-alert>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: 'danger'
    },
    mode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  created() {
    this.$store.dispatch('Notification/alertShowSet', false)
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    },
    alertState() {
      return this.$store.state['Notification'].alert
    },
    show: {
      set(show) {
        this.$store.dispatch('Notification/alertShowSet', show)
      },
      get() {
        return this.$store.state['Notification'].alert.show
      }
    }
  },
  methods: {}
}
</script>

<style lang="css" scoped>
.alert-message {
  width: 45em;
  height: 5em;
}
.alert-new {
  width: 25em;
}
</style>