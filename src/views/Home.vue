<template>
  <div>
    <div class="jumbotron jumbotron-fluid mt-5">
      <div class="container">
        <h1 class="display-4">g3tools Sandbox</h1>
        <p class="lead">
          A collection of g3tools front end components written in Vue and styled
          with Bootstrap 4.0.
        </p>
      </div>
    </div>
    <div>
      <transition name="fade">
        <!-- Modal -->
        <div v-if="isVisible" id="modal">
          <div class="modal-mask">
            <div class="modal-wrapper">
              <div class="modal-dialog" role="dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true" @click="closeModal"
                        >&times;</span
                      >
                    </button>
                  </div>
                  <div class="modal-body">
                    <p>Modal body text goes here.</p>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="closeModal"
                    >
                      Close
                    </button>
                    <button type="button" class="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="modal-close" @click="closeModal"></button>
        </div>
      </transition>

      <button type="button" class="btn btn-primary" @click="showModal">
        Modal
      </button>
    </div>
  </div>
</template>

<script>
//import RestrictedService from "../services/RestrictedService"

export default {
  props: [],
  data() {
    return {
      modal: true,
      isActive: false,
      isVisible: false,
    };
  },
  computed: {},
  mounted() {
    // runs when the element is injected into the browser
  },
  methods: {
    showModal: function () {
      // document.getElementById('modal').classList.add('is-active')
      this.isActive = true;
      this.isVisible = true;
    },
    closeModal: function () {
      // document.getElementById('modal').classList.remove('is-active')
      this.isActive = false;
      this.isVisible = false;
    },
  },
};
</script>

<style lang="css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.modal-background {
  opacity: 0.2;
}
</style>
