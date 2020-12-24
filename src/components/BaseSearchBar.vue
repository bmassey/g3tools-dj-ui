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
    searchText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      localSearchText: this.searchText,
    };
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
  methods: {
    search() {
      if (this.localSearchText === "") return;
      this.$emit("search-attempt", this.localSearchText);
    },
    clear() {
      if (this.localSearchText === "") return;
      this.localSearchText = "";
      this.$emit("search-attempt", "");
    },
  },
};
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
