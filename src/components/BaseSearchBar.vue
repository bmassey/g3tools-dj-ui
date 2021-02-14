<template>
  <div class="input-group searchbox">
    <input
      v-model="searchText"
      type="text"
      class="form-control"
      placeholder="Search..."
      @keyup.enter="search"
    />
    <!-- Clear search button -->
    <button
      class="btn bg-transparent search-cancel"
      :class="{ disabled: searchText === '' }"
      @click="clear"
    >
      <i class="fas fa-times color-secondary"></i>
    </button>
    <!-- Search button -->
    <BaseSearchButton :searchText="searchText" @search-click="search" />
  </div>
</template>

<script>
// import utils from '../utils/jsUtils'

export default {
  props: {
    namespace: { type: String, default: '' }
  },
  data() {
    return {}
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    },
    searchText: {
      get() {
        return this.state.searchText
      },
      set(value) {
        this.$store.commit(`${this.namespace}/SEARCH_TEXT_SET`, value)
      }
    }
    // ...utils.mapStateTwoWay(this.namespace, {
    //   searchText: 'SEARCH_TEXT_SET'
    // })
  },
  methods: {
    search() {
      if (this.searchText === '') return
      this.$store.dispatch(`${this.namespace}/search`, this.searchText)
    },
    clear() {
      if (this.searchText === '') return
      this.searchText = ''
      this.$store.dispatch(`${this.namespace}/search`, this.searchText)
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
