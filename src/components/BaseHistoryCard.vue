<template>
  <!-- Supplemental History card -->
  <div class="accordion" role="tablist">
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button v-b-toggle.history-1 block variant="outline-secondary"
          >History</b-button
        >
      </b-card-header>
      <b-collapse id="history-1" accordion="info-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text v-for="(hx, index) in history" :key="index">
            <p>{{ hx }}</p>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import dateUtils from "../utils/dateUtils.js";

export default {
  name: "BaseInformationCard",
  props: { item: { type: Object, default: null } },
  data() {
    return {
      history: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Gravida arcu ac tortor dignissim. Pulvinar pellentesque habitant",
        "Ligula ullamcorper malesuada proin libero nunc consequat.",
      ],
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