<template>
  <!-- Search button -->
  <div class="input-group-append">
    <button
      class="btn btn-secondary search-accept"
      :class="{ disabled: searchText === '' }"
      @click.prevent="$emit('search-click')"
    >
      <i class="fas fa-search"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    searchText: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="css" scoped>
.search-accept {
  z-index: 100;
  margin-bottom: 2px;
  margin-left: 2px;
}
</style>