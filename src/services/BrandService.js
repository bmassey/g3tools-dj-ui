import axios from "axios"

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
})

// before a request is made start the nprogress
apiClient.interceptors.request.use((config) => {
  //NProgress.start()
  return config
})

// before a response is returned stop nprogress
apiClient.interceptors.response.use((response) => {
  //NProgress.done()
  return response
})

export default {
  getBrands(
    pageSize = 25,
    currentPage = 1,
    orderBy = "brandName",
    orderDir = "asc",
    searchText = ""
  ) {
    let query = `?limit=${pageSize}&page=${currentPage}&orderBy=${orderBy}&orderDir=${orderDir}`
    if (searchText !== "") query = `${query}&searchText=${searchText}`
    const url = searchText !== "" ? "/brands/find" : "/brands"
    return apiClient.get(`${url}${query}`)
  },
  // findBrands(searchText) {
  //   return apiClient.get(`/brands/find?searchText=${searchText}`)
  // },
  getBrand(id) {
    return apiClient.get(`/brands/${id}`)
  },
}
