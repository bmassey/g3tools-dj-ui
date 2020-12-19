import axios from "axios"

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
})

export default {
  getBrands(pageSize = 25, orderBy = "brandName", orderDir = "ASC") {
    return apiClient.get(
      `/brands?limit=${pageSize}?page=1&orderBy=${orderBy}&orderDir=${orderDir}`
    )
  },
  getBrand(id) {
    return apiClient.get(`/brands/${id}`)
  },
}
