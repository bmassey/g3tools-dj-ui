import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json'
  }
})

// before a request is made start the nprogress
apiClient.interceptors.request.use(config => {
  //NProgress.start()
  return config
})

// before a response is returned stop nprogress
apiClient.interceptors.response.use(
  response => {
    //NProgress.done()
    return response
  },
  error => {
    const resError = {
      // Handle error
      statusCode: (error && error.response && error.response.status) || '',
      message:
        (error &&
          error.response &&
          error.response.data &&
          error.response.data.errors &&
          error.response.data.errors[0].msg) ||
        'Unknown network error'
    }
    return Promise.reject(resError)
  }
)

export default {
  // Retrieve records optionally using search text or filter
  getBrands(
    pageSize = 25,
    currentPage = 1,
    orderBy = 'brandName',
    orderDir = 'asc',
    searchText = '',
    filter = ''
  ) {
    let query = `?limit=${pageSize}&page=${currentPage}&orderBy=${orderBy}&orderDir=${orderDir}`
    if (searchText !== '') query = `${query}&searchText=${searchText}`
    if (filter != '') query = `${query}&filter=${filter}`
    const url = searchText !== '' || filter !== '' ? '/brands/find' : '/brands'

    return apiClient.get(`${url}${query}`)
  },
  // Get single record
  getBrand(id) {
    return apiClient.get(`/brands/${id}`)
  },

  // Create a single record
  async createBrand(payload) {
    const newItem = await apiClient.post('/brands', payload)
    return newItem
  },
  // Save a single record
  async saveBrand(payload) {
    try {
      const record = await apiClient.put(`/brands/${payload.id}`, payload)
      return record
    } catch (err) {
      console.error(`Error saving record: ${err}`)
    }
  },
  // Delete a single record
  async deleteItem(id) {
    try {
      await apiClient.delete(`/brands/${id}`)
    } catch (err) {
      console.error(`Error deleting record: ${err}`)
    }
  }
}
