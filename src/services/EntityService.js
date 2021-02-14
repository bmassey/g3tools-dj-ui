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
  getItems(
    entity = '',
    pageSize = 25,
    currentPage = 1,
    orderBy = '',
    orderDir = '',
    searchText = '',
    filter = ''
  ) {
    let query = `?limit=${pageSize}&page=${currentPage}&orderBy=${orderBy}&orderDir=${orderDir}`
    if (searchText !== '') query = `${query}&searchText=${searchText}`
    if (filter != '') query = `${query}&filter=${filter}`
    const url =
      searchText !== '' || filter !== '' ? `/${entity}/find` : `/${entity}`

    return apiClient.get(`${url}${query}`)
  },
  // Get single record
  getItem(id, entity) {
    return apiClient.get(`/${entity}/${id}`)
  },

  // Create a single record
  async createItem(entity, payload) {
    const newItem = await apiClient.post(`/${entity}`, payload)
    return newItem
  },
  // Save a single record
  async saveItem(entity, payload) {
    try {
      const record = await apiClient.put(`/${entity}/${payload.id}`, payload)
      return record
    } catch (err) {
      console.error(`Error saving record: ${err}`)
    }
  },
  // Delete a single record
  async deleteItem(entity, id) {
    try {
      await apiClient.delete(`/${entity}/${id}`)
    } catch (err) {
      console.error(`Error deleting record: ${err}`)
    }
  },
  // Retrieve list based on passed in parameters (used to retrieve
  // drop down lists). Returns array of option items
  async getOptionsList(entity = '', endPoint = '', fieldName = '') {
    const url = `/${entity}/${endPoint}`
    const results = await apiClient.get(`${url}`)
    let a = []
    for (let i = 0; i < results.data.length; i++) {
      a.push(results.data[i][fieldName])
    }
    return a
  }
}
