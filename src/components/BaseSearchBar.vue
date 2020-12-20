<template>
  <div>
    <div class="input-group mb-1 searchbox">
      <input
        type="text"
        v-model="localSearchText"
        class="form-control"
        placeholder="Search..."
        v-on:keyup.enter="search"
      />
      <!-- Search button -->
      <div class="input-group-append">
        <button class="btn btn-primary search-accept" v-on:click="search">
          <i class="fa fa-search"></i>
        </button>
      </div>
      <!-- Clear search button -->
      <button class="btn bg-transparent search-cancel" @click="clear">
        <i class="fa fa-times color-secondary"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: { searchText: String },
  data() {
    return {
      localSearchText: this.searchText,
    }
  },
  methods: {
    search() {
      this.$emit("search-attempt", this.localSearchText)
    },
    clear() {
      this.localSearchText = ""
      this.$emit("search-attempt", "")
    },
  },
  watch: {
    // searchText: {
    //   handler: function(n) {
    //     console.log("watch:", n)
    //     this.localSearchText = n
    //   },
    //   deep: true,
    // },
  },
}
</script>

<style lang="css" scoped>
.searchbox {
  width: 300px;
}
.search-cancel {
  margin-left: -80px;
  z-index: 100;
}
.search-accept {
  margin-left: -40px;
  z-index: 100;
}
.fa-times {
  color: grey;
}
</style>
