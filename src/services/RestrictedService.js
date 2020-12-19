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
  getItems() {
    return apiClient.get("/restricted")
  },
  gettem(id) {
    return apiClient.get(`/restricted/${id}`)
  },
}
