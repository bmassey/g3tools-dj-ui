<template>
  <div>
    <!-- Add -->
    <b-button
      v-b-modal.add-modal
      class="b-button add-button"
      title="Add a new record"
      @click.prevent="$emit('action-add')"
    >
      <i class="fas fa-plus-circle add-icon"></i>
    </b-button>
    <!-- Refresh -->
    <b-button
      class="b-button refresh-button"
      title="Refresh the list"
      @click.prevent="$emit('action-refresh')"
    >
      <i class="fas fa-sync-alt refresh-icon"></i>
    </b-button>
    <!-- Delete -->
    <b-button
      class="b-button add-button"
      title="Delete selected rows"
      :disabled="selectedCount === 0"
      @click.prevent="$emit('action-delete')"
    >
      <i class="fas fa-trash delete-icon"></i>
    </b-button>
  </div>
</template>

<script>
export default {
  props: {
    selectedCount: { type: Number, default: 0 },
  },
};
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
  transform: scale(1.2, 1.2);
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