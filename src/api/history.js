import axios from '@/api/axios'

const day = parameters => {
  return axios.get('api/operation-history-day', {params: parameters})
}

const month = params => {
  return axios.get('api/operation-history-month', {params: params})
}

const categoryOperationHistory = (k_category, params) => {
  return axios.get('api/operation-category-history/'+k_category, {params: params})
}

const groupOperationHistory = (k_category_group, params) => {
  return axios.get('api/operation-group-history/'+k_category_group, {params: params})
}

export default {
  categoryOperationHistory,
  groupOperationHistory,
  day,
  month,
}