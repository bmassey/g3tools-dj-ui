<template>
  <!-- Supplemental Information card -->
  <div class="accordion" role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button v-b-toggle.info-1 block variant="outline-secondary"
          >Information</b-button
        >
      </b-card-header>
      <b-collapse id="info-1" accordion="info-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text>
            <div class="row">
              <div class="col-sm-5 text-right info-label">Id:</div>
              <div class="col-sm-7 pl-0">{{ info.id }}</div>
            </div>
          </b-card-text>
          <div class="row">
            <div class="col-sm-5 text-right info-label">Created:</div>
            <div class="col-sm-7 pl-0">
              {{ formatDate(info.createdOn) }}
            </div>
          </div>
          <div class="row">
            <div class="col-sm-5 text-right info-label">by:</div>
            <div class="col-sm-7 pl-0">{{ info.createdBy }}</div>
          </div>
          <div class="row">
            <div class="col-sm-5 text-right info-label">Modified:</div>
            <div class="col-sm-7 pl-0">
              {{ formatDate(info.modifiedOn) }}
            </div>
          </div>
          <div class="row">
            <div class="col-sm-5 text-right info-label">by:</div>
            <div class="col-sm-7 pl-0">{{ info.modifiedBy }}</div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import dateUtils from "../utils/dateUtils.js";

export default {
  name: "BaseInformationCard",
  props: { info: { type: Object, default: null } },
  data() {
    return {
      //      recordId: this.item.id || "",
    };
  },
  methods: {
    formatDate: function (rawDate) {
      return dateUtils.formatDate(rawDate);
    },
  },
};
</script>

<style lang="css" scoped>
.info-label {
  color: grey;
}
.info-card-header {
  margin-top: -12px;
  margin-bottom: -10px;
}
</style>