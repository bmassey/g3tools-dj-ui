<template>
  <div style="display: flex">
    <!-- Show fitler row -->
    <b-button
      class="b-button"
      title="Add a new record"
      @click.prevent="$emit('action-filter')"
    >
      <i
        class="fas fa-filter"
        :class="[state.showFilterRow ? 'filter-icon-active' : 'filter-icon']"
      ></i>
    </b-button>
    <!-- Add -->
    <b-button
      class="b-button add-button"
      title="Add a new record"
      @click.prevent="$emit('action-add')"
    >
      <i class="fas fa-plus-circle add-icon"></i>
    </b-button>
    <!-- Refresh -->
    <b-button
      class="b-button refresh-button"
      :title="refreshTooltip"
      @click.prevent="refresh"
    >
      <i class="fas fa-sync-alt refresh-icon"></i>
    </b-button>
    <BaseHeadingOtherAction :namespace="namespace" />
  </div>
</template>

<script>
export default {
  props: {
    namespace: { type: String, default: '' }
  },
  computed: {
    state() {
      return this.$store.state[this.namespace]
    },
    selectedCount() {
      return this.state.selectedItems.length
    },
    refreshTooltip() {
      return `Refresh list (${this.state.itemsLastRefreshed})`
    }
  },
  methods: {
    async refresh() {
      this.$store.dispatch(`${this.namespace}/resetFilters`)
      // this.$store.commit(`${this.namespace}/RESET`)
      await this.$store.dispatch(`${this.namespace}/filterApply`)
      await this.$store.dispatch(`${this.namespace}/fetchItems`, true)
    }
  }
}
</script>

<style lang="css" scoped>
i {
  font-size: 1.6em;
  color: rgb(73, 73, 73);
  padding: 0px;
  margin: 0px;
  transition: 0.2s;
}
i:hover {
  transform: scale(1.1, 1.1);
}

.btn {
  background-color: transparent;
  border: none;
  margin-right: 2px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 8px;
  padding-right: 8px;
}
.add-icon {
  font-size: 1.6em;
  color: #007bff;
  vertical-align: middle;
}
.filter-icon {
  font-size: 1.4em;
  color: rgb(73, 73, 73);
  vertical-align: middle;
}
.filter-icon-active {
  font-size: 1.4em;
  color: #007bff;
  vertical-align: middle;
}
.delete-icon {
  font-size: 1.4em;
  color: rgb(73, 73, 73);
  vertical-align: middle;
}
.refresh-icon {
  font-size: 1.4em;
  vertical-align: middle;
  color: rgb(73, 73, 73);
}
</style>