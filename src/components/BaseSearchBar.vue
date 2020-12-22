<template>
  <div class="input-group searchbox">
    <input
      type="text"
      v-model="localSearchText"
      class="form-control"
      placeholder="Search..."
      v-on:keyup.enter="search"
    />
    <!-- Clear search button -->
    <button
      class="btn bg-transparent search-cancel"
      @click="clear"
      :class="{ disabled: localSearchText === '' }"
    >
      <i class="fa fa-times color-secondary"></i>
    </button>
    <!-- Search button -->
    <div class="input-group-append">
      <button
        class="btn btn-secondary search-accept"
        v-on:click="search"
        :class="{ disabled: localSearchText === '' }"
      >
        <i class="fa fa-search"></i>
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
      if (this.localSearchText === "") return
      this.$emit("search-attempt", this.localSearchText)
    },
    clear() {
      if (this.localSearchText === "") return
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
  width: 250px;
}
.search-cancel {
  margin-left: -80px;
  z-index: 100;
}
.search-accept {
  z-index: 100;
}
.fa-times {
  color: grey;
}
</style>
