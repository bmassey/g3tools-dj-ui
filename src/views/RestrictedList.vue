<template>
  <div class="container" style="margin-top: 60px">
    <h3>Restricted List</h3>
    <table class="table table-hover table-sm">
      <thead class="thead-light">
        <tr>
          <th scope="col">Item Number</th>
          <th scope="col">Brand</th>
          <th scope="col">Description</th>
          <th scope="col">Reason</th>
          <th scope="col">Enabled</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td>{{ item.itemNumber }}</td>
          <td>{{ item.brandName }}</td>
          <td>{{ item.productDescription }}</td>
          <td>{{ item.restrictedReason }}</td>
          <td>{{ item.enabled }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import RestrictedService from "../services/RestrictedService"

export default {
  props: [],
  data() {
    return {
      data_fetched: false,
      data: [],
    }
  },
  async created() {
    // runs when the component is created
    try {
      const response = await RestrictedService.getItems()
      this.data = response.data.results
    } catch (error) {
      console.log(`There was an error: ${error.response}`)
    }
  },
  mounted() {
    // runs when the element is injected into the browser
  },
  computed: {},
  methods: {},
}
</script>
