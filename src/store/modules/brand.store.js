import EntityService from '@/services/EntityService'
import router from '../../router'
import _ from 'lodash'

// Initial state
const inititalState = () => ({
  entity: 'brand',
  title: 'Brand List',
  subTitle:
    'Use this to maintain a list of brands, including a unique prefix, used in brand numbers.',
  dataLoading: false,
  items: [],
  itemsLastRefreshed: '',
  totalRows: 0,
  item: {},
  pageSize: 50,
  pageInStore: 0,
  totalPages: 1,
  pageArray: [1, 2, 3, 4, 5, 6, 7],
  currentSort: 'modifiedOn',
  currentSortDir: 'desc',
  sortIndicator: 'fa-sort-down',
  searchText: '',
  filter: 'active=true',
  showFilterRow: false,
  selectedItems: [],
  columns: [
    {
      dbName: 'brandName',
      headingName: 'Brand Name',
      sortable: true,
      columnType: 'link',
      filterable: true,
      filterType: 'text'
    },
    {
      dbName: 'abbreviation',
      headingName: 'Abbrev',
      sortable: true,
      columnType: 'text',
      filterable: true,
      filterType: 'text'
    },
    {
      dbName: 'vendorName',
      headingName: 'Vendor Name',
      sortable: true,
      columnType: 'text',
      filterable: true,
      filterType: 'text'
    },
    {
      dbName: 'active',
      headingName: 'Active',
      sortable: true,
      columnType: 'checkbox',
      filterable: false,
      filterType: 'checkbox'
    },
    {
      dbName: 'modifiedOn',
      headingName: 'Last Modified',
      sortable: true,
      columnType: 'datetime',
      filterable: true,
      filterType: 'text'
    }
  ],
  activeFilterButtons: [
    {
      btnName: 'active',
      btnLabel: 'Active',
      value: 'active'
    },
    {
      btnName: 'inactive',
      btnLabel: 'Inactive',
      value: 'inactive'
    },
    {
      btnName: 'all',
      btnLabel: 'All',
      value: 'all'
    }
  ]
})
// State object
const state = inititalState

// Getter functions
const getters = {
  getItemById: state => id => {
    return state.items.find(item => item.id === id)
  },
  getSortIndicator: state => field => {
    // Show indicator if current column is being sorted
    if (state.currentSort === field) {
      return state.sortIndicator
    } else {
      // not on this column: send nothing
      return ''
    }
  }
}

// Actions
const actions = {
  dataLoadingSet({ commit }, isLoading) {
    commit('DATA_LOADING_SET', isLoading)
  },
  async fetchItem({ commit, state, dispatch }, id) {
    try {
      dispatch('dataLoadingSet', true)
      const response = await EntityService.getItem(state.entity, id)
      commit('ITEM_SET', response.data)
      dispatch('dataLoadingSet', false)
    } catch (error) {
      console.log('There was an error:', error.response)
    }
  },
  async deleteSelectedItems({ commit, state, dispatch }) {
    let i = 0
    try {
      // Change records to active / inactive
      const promises = state.selectedItems.map(async itemId => {
        // Delete item from database
        dispatch('dataLoadingSet', true)
        await EntityService.deleteItem(state.entity, itemId)
        // Delete item from items list
        commit('ITEM_REMOVE', itemId)
        commit('TOTAL_ROWS_SET', state.totalRows - 1)
        i++
        return
      })
      await Promise.all(promises)
      dispatch('dataLoadingSet', false)
      // Success: Tell user
      const msg = `Successfully deleted ${i >= 200 ? 'maximum of 200' : i} ${
        i > 1 ? 'records' : 'record'
      }`
      dispatch('Notification/toastMsgAdd', msg, {
        root: true
      })
      // Update state
      commit('SELECTED_ITEMS_CLEAR')
      i = 0
    } catch (err) {
      const msg = `Error delete record: ${err}`
      dispatch('Notification/toastErrorAdd', msg, {
        root: true
      })
    }
    i = 0
  },
  entitySet({ commit }, payload) {
    commit('ENTITY_SET', payload)
  },
  async fetchItems({ commit, state, dispatch }, force = false) {
    // See if we already have this page in the store and use it, avoiding api call
    if (force) {
      if (router.history.current.path !== '/brand-list')
        router.push({ path: `/brand-list` })
    }
    const currPage = router.history.current.query.page || 1
    if (currPage !== state.pageInStore || force) {
      try {
        dispatch('dataLoadingSet', true)
        const response = await EntityService.getItems(
          state.entity,
          state.pageSize,
          force ? 1 : currPage,
          state.currentSort,
          state.currentSortDir,
          state.searchText,
          state.filter
        )
        // Success
        // Check for results
        const totalRows = parseInt(response.headers['x-total-count']) || 0
        const totalPages = parseInt(response.headers['x-max-pages']) || 0

        commit('ITEMS_SET', totalRows > 0 ? response.data : [])
        const last = `Last refreshed: ${new Date().toLocaleString()}`
        commit('ITEMS_SET_LAST', last)
        commit('TOTAL_ROWS_SET', totalRows)
        commit('TOTAL_PAGES_SET', totalPages)
        // Set this to avoid api call when coming back to this page
        commit('PAGE_IN_STORE_SET', currPage)
        dispatch('dataLoadingSet', false)
      } catch (error) {
        console.log('There was an error retrieving brands:', error)
        dispatch('dataLoadingSet', false)
      }
    }
  },
  filterActive({ commit, dispatch }, activeOption) {
    commit('FILTER_SET', '')
    if (activeOption === 'active') commit('FILTER_SET', 'active=true')
    else if (activeOption === 'inactive') commit('FILTER_SET', 'active=false')
    dispatch('fetchItems', true)
  },
  itemAdd({ commit }, item) {
    commit('ITEM_ADD', item)
  },
  async itemCreate({ commit, dispatch, state }, item) {
    // Save to database
    try {
      commit('DATA_LOADING_SET', true)
      const response = await EntityService.createItem(state.entity, item)
      // Call mutation after successful save
      commit('ITEM_ADD', item)
      const msg = `Successfully added brand ${item.brandName}`
      dispatch('Notification/toastMsgAdd', msg, { root: true })
      commit('DATA_LOADING_SET', false)
      return response
    } catch (error) {
      // HTTP error: Alert
      const msg =
        error.message === 'Unknown network error' && error.statusCode !== ''
          ? `${error.message} (${error.statusCode})`
          : error.message
      commit('DATA_LOADING_SET', false)
      dispatch('Notification/alertErrorAdd', msg, { root: true })
      throw error
    }
  },
  itemEdit({ commit }, item) {
    commit('ITEM_EDIT', item)
  },
  async itemSave({ commit, dispatch, state }, { item, postToast }) {
    // Save item to database
    commit('DATA_LOADING_SET', true)
    try {
      const response = await EntityService.saveItem(state.entity, item)
      // Call mutation after successful save
      commit('ITEM_EDIT', item)
      if (postToast) {
        const msg = `Successfully saved brand ${item.brandName}`
        dispatch('Notification/toastMsgAdd', msg, { root: true })
      }
      commit('DATA_LOADING_SET', false)
      return response
    } catch (error) {
      const msg =
        error.message === 'Unknown network error' && error.statusCode !== ''
          ? `${error.message} (${error.statusCode})`
          : error.message
      commit('DATA_LOADING_SET', false)
      dispatch('Notification/alertErrorAdd', msg, { root: true })
      throw error
    }
  },
  itemSet({ commit }, item) {
    commit('ITEM_SET', item)
  },
  pageArraySet({ commit }, value) {
    commit('PAGE_ARRAY_SET', value)
  },
  pageSizeSet({ commit }, pageSize) {
    //if (pageSize >= state.totalRows) commit('PAGE_SIZE_SET', -1)
    commit('PAGE_SIZE_SET', pageSize)
  },
  reset({ commit }) {
    commit('RESET')
  },
  resetFilters({ commit }) {
    commit('SEARCH_TEXT_SET', '')
    commit('FILTER_SET', 'active=true')
  },
  search({ commit, dispatch }, searchText) {
    commit('SEARCH_TEXT_SET', searchText)
    // Server-side filtering
    dispatch('fetchItems', true)
  },
  selectedItemsAdd({ commit }, id) {
    commit('SELECTED_ITEMS_ADD', id)
  },
  selectedItemsClear({ commit }, id) {
    commit('SELECTED_ITEMS_ADD', id)
  },
  selectedItemsRemove({ commit }, index) {
    commit('SELECTED_ITEMS_REMOVE_ID', index)
  },
  selectedItemsSet({ commit }, ids) {
    commit('SELECTED_ITEMS_SET', ids)
  },
  showFilterRowSet({ commit }, value) {
    commit('SHOW_FILTER_ROW_SET', value)
  },
  sortSet({ commit }, { currentSort, currentSortDir }) {
    commit('CURRENT_SORT_SET', currentSort)
    commit('CURRENT_SORT_DIR_SET', currentSortDir)
  },
  // Sort actions
  sort({ commit, state, dispatch }, field) {
    // 2-way sort only: asc, desc
    if (field !== state.currentSort) {
      // Reset sort and direction
      commit('CURRENT_SORT_SET', field)
      commit('CURRENT_SORT_DIR_SET', 'asc')
      commit('SORT_INDICATOR_SET', 'fa-sort-up')
    } else if (state.currentSortDir === 'asc') {
      // Same field, flip from asc to desc
      commit('CURRENT_SORT_SET', field)
      commit('CURRENT_SORT_DIR_SET', 'desc')
      commit('SORT_INDICATOR_SET', 'fa-sort-down')
    } else if (state.currentSortDir === 'desc') {
      // Same field, flip from desc to asc
      commit('CURRENT_SORT_SET', field)
      commit('CURRENT_SORT_DIR_SET', 'asc')
      commit('SORT_INDICATOR_SET', 'fa-sort-up')
    }
    // Client or server-side sorting?
    if (state.totalPages === 1) {
      // All records are retrieved: Client sort
      state.items = _.orderBy(
        state.items,
        state.currentSort,
        state.currentSortDir
      )
    } else {
      // Server-side sorting
      dispatch('fetchItems', true)
    }
  },
  titleSet({ commit }, payload) {
    commit('TITLE_SET', payload)
  },
  subTitleSet({ commit }, payload) {
    commit('SUB_TITLE_SET', payload)
  }
}

// Mutations
const mutations = {
  ACTIVE_FILTER_BUTTONS_SET(state, value) {
    state.activeFilterButtons = value
  },
  CURRENT_SORT_SET(state, value) {
    state.currentSort = value
  },
  CURRENT_SORT_DIR_SET(state, value) {
    state.currentSortDir = value
  },
  DATA_LOADING_SET(state, isLoading) {
    state.dataLoading = isLoading
  },
  ENTITY_SET(state, value) {
    state.entity = value
  },
  FILTER_SET(state, value) {
    state.filter = value
  },
  ITEM_ADD(state, item) {
    state.items.push(item)
  },
  ITEM_EDIT(state, payload) {
    // Replace passed in item within items array
    var oldItem = state.items.find(x => x.id === payload.id)
    Object.assign(oldItem, payload)
  },
  ITEM_REMOVE(state, idToRemove) {
    state.items = state.items.filter(item => item.id !== idToRemove)
  },
  ITEM_SET(state, item) {
    state.item = item
  },
  ITEMS_SET(state, items) {
    state.items = items
  },
  ITEMS_SET_LAST(state, value) {
    state.itemsLastRefreshed = value
  },
  PAGE_ARRAY_SET(state, value) {
    state.pageArray = value
  },
  PAGE_IN_STORE_SET(state, page) {
    // Remember the page number used to retrieve this list of items
    state.pageInStore = page
  },
  PAGE_SIZE_SET(state, pageSize) {
    state.pageSize = pageSize
  },
  RESET(state) {
    const newState = state.initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  },
  SEARCH_TEXT_SET(state, value) {
    state.searchText = value
  },
  SHOW_FILTER_ROW_SET(state, value) {
    state.showFilterRow = value
  },
  SELECTED_ITEMS_ADD(state, id) {
    state.selectedItems.push(id)
  },
  SELECTED_ITEMS_CLEAR(state) {
    state.selectedItems = []
  },
  SELECTED_ITEMS_REMOVE_ID(state, index) {
    state.selectedItems.splice(index, 1)
  },
  SELECTED_ITEMS_SET(state, ids) {
    state.selectedItems = ids
  },
  SORT_INDICATOR_SET(state, value) {
    state.sortIndicator = value
  },
  SUB_TITLE_SET(state, value) {
    state.subTitle = value
  },
  TITLE_SET(state, value) {
    state.title = value
  },
  TOTAL_PAGES_SET(state, totalPages) {
    state.totalPages = totalPages
  },
  TOTAL_ROWS_SET(state, total) {
    state.totalRows = total
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
