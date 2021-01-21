<template>
  <div class="input-group searchbox">
    <input
      v-model="localSearchText"
      type="text"
      class="form-control"
      placeholder="Search..."
      @keyup.enter="search"
    />
    <!-- Clear search button -->
    <button
      class="btn bg-transparent search-cancel"
      :class="{ disabled: localSearchText === '' }"
      @click="clear"
    >
      <i class="fas fa-times color-secondary"></i>
    </button>
    <!-- Search button -->
    <div class="input-group-append">
      <button
        class="btn btn-secondary search-accept"
        :class="{ disabled: localSearchText === '' }"
        @click="search"
      >
        <i class="fas fa-search"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    namespace: { type: String, default: '' }
  },
  data() {
    return {
      localSearchText: ''
    }
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    }
  },
  methods: {
    search() {
      if (this.localSearchText === '') return
      this.$store.dispatch(`${this.namespace}/search`, this.localSearchText)
    },
    clear() {
      if (this.localSearchText === '') return
      this.localSearchText = ''
      this.$store.dispatch(`${this.namespace}/search`, this.localSearchText)
    }
  }
}
</script>

<style lang="css" scoped>
.searchbox {
  width: 255px;
}
.search-cancel {
  margin-left: -80px;
  z-index: 100;
}
.search-accept {
  z-index: 100;
  margin-bottom: 2px;
  margin-left: 2px;
}
.fa-times {
  color: grey;
}
</style>
