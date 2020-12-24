<template>
  <div class="d-flex flex-row align-items-baseline bg mb-1">
    <div class="h4 mr-3">{{ title }}</div>
    <div>{{ subTitle }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    subTitle: String,
  },
};
</script>

<style lang="css" scoped></style>
