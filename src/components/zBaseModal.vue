<template>
  <div>
    <transition name="fade">
      <div v-if="localShowModal" id="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog" role="dialog">
              <div class="modal-content">
                <!-- Header -->
                <div class="modal-header">
                  <h5 class="modal-title">
                    <slot name="header">Default Header Text</slot>
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true" @click="close">&times;</span>
                  </button>
                </div>
                <!-- Body -->
                <div class="modal-body">
                  <slot name="body">
                    <p>Default modal body</p>
                  </slot>
                </div>
                <!-- Footer -->
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary">
                    Save changes
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="close"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "BaseModal",
  props: { showModal: { type: Boolean, default: false } },
  data() {
    return { localShowModal: this.showModal };
  },
  watch: {
    showModal: function () {
      this.localShowModal = this.showModal;
    },
  },
  methods: {
    close: function () {
      this.localShowModal = false;
      this.$emit("add-closed");
    },
  },
};
</script>

<style lang="css" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0s linear;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.modal-background {
  opacity: 0;
}
</style>