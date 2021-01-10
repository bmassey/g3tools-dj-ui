import BrandService from '@/services/BrandService'
import { toast } from '@/utils/uiUtils'
import router from '../../router'
import _ from 'lodash'

// Initial state
const inititalState = () => ({
  title: 'Brand List',
  subTitle:
    'Use this to maintain a list of brands, including a unique prefix, used in brand numbers.',
  dataLoading: false,
  items: [],
  totalRows: 0,
  item: {},
  pageSize: 50,
  pageInStore: 0,
  totalPages: 1,
  pageArray: [1, 2, 3, 4, 5, 6, 7],
  currentSort: 'brandName',
  currentSortDir: 'asc',
  sortIndicator: 'fa-sort-up',
  searchText: '',
  filter: 'active=true',
  selectedItems: [],
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
  getBrandById: state => id => {
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
  fetchItem({ commit }, id) {
    // Try and get brand from store first (avoids api call)
    //const item = getters.getBrandById(id)

    //if (item) {
    //  commit('ITEM_SET', item)
    //} else {
    BrandService.getBrand(id)
      .then(response => {
        commit('ITEM_SET', response.data)
      })
      .catch(error => {
        console.log('There was an error:', error.response)
        // const notification = {
        //   type: 'error',
        //   message: `There was a problem fetching brand: ${error.message}`
        // }
        // dispatch('notification/add', notification, { root: true })
      })
    //}
  },
  fetchItems({ commit, state, dispatch }, force = false) {
    // See if we already have this page in the store and use it, avoiding api call
    if (force) {
      if (router.history.current.path !== '/brand-list')
        router.push({ path: `/brand-list` })
    }
    const currPage = router.history.current.query.page || 1
    if (currPage !== state.pageInStore || force) {
      dispatch('dataLoadingSet', true)
      BrandService.getBrands(
        state.pageSize,
        force ? 1 : currPage,
        state.currentSort,
        state.currentSortDir,
        state.searchText,
        state.filter
      )
        .then(response => {
          // Success
          commit('ITEMS_SET', response.data)
          commit(
            'TOTAL_ROWS_SET',
            parseInt(response.headers['x-total-count']) || 0
          )
          commit(
            'TOTAL_PAGES_SET',
            parseInt(response.headers['x-max-pages']) || 0
          )
          // Set this to avoid api call when coming back to this page
          commit('PAGE_IN_STORE_SET', currPage)
          dispatch('dataLoadingSet', false)
        })
        .catch(error => {
          console.log('There was an error retrieving brands:', error)
          dispatch('dataLoadingSet', false)
          //  dispatch('dataLoadingSet', false)
          // const notification = {
          //   type: 'error',
          //   message: `There was a problem fetching brands: ${error.message}`
          // }
          // dispatch('notification/add', notification, { root: true })
        })
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
  itemEdit({ commit }, item) {
    commit('ITEM_EDIT', item)
  },
  async itemSave({ commit }, { item, postToast }) {
    // Save item to database
    commit('DATA_LOADING_SET', true)

    return await BrandService.saveBrand(item)
      .then(() => {
        // Call mutation after successful save
        commit('ITEM_EDIT', item)
        if (postToast) {
          const msg = `Successfully saved brand ${item.brandName}`
          toast(msg, 'success')
        }
        commit('DATA_LOADING_SET', false)
      })
      .catch(error => {
        const msg = `There was a problem saving brand: ${error.message}`
        toast(msg, 'error')
        commit('DATA_LOADING_SET', false)
        throw error
      })
  },
  itemCreate({ commit }, item) {
    // Save to database
    commit('DATA_LOADING_SET', true)
    return BrandService.createBrand(item)
      .then(() => {
        // Call mutation after successful save
        console.log('saved successfully', item)
        commit('ITEM_ADD', item)
        const msg = `Successfully added brand ${item.brandName} to database`
        toast(msg, 'success')
        commit('DATA_LOADING_SET', false)
      })
      .catch(error => {
        const msg = `There was a problem creating your brand: ${error.message}`
        toast(msg, 'error')
        commit('DATA_LOADING_SET', false)
        throw error
      })
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
  search({ commit, dispatch }, searchText) {
    commit('SEARCH_TEXT_SET', searchText)
    // Server-side filtering
    dispatch('fetchItems', true)
  },
  selectedItemsAdd({ commit }, id) {
    commit('SELECTED_ITEMS_ADD', id)
  },
  selectedItemsRemove({ commit }, index) {
    commit('SELECTED_ITEMS_REMOVE_ID', index)
  },
  selectedItemsSet({ commit }, ids) {
    commit('SELECTED_ITEMS_SET', ids)
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
  }
}

// Mutations
const mutations = {
  CURRENT_SORT_SET(state, value) {
    state.currentSort = value
  },
  CURRENT_SORT_DIR_SET(state, value) {
    state.currentSortDir = value
  },
  DATA_LOADING_SET(state, isLoading) {
    state.dataLoading = isLoading
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
  ITEM_REMOVE(state, itemToRemove) {
    state.items = state.items.filter(item => item.id !== itemToRemove.id)
  },
  ITEM_SET(state, item) {
    state.item = item
  },
  ITEMS_SET(state, items) {
    state.items = items
  },
  PAGE_ARRAY_SET(state, value) {
    state.pageArray = value
  },
  PAGE_IN_STORE_SET(state, page) {
    // Remember the page number used to retrieve this list brands
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
  SELECTED_ITEMS_ADD(state, id) {
    state.selectedItems.push(id)
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
