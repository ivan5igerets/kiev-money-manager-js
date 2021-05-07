import axios from '@/api/axios'

const categoriesGet = parameters => {
  return axios.get('api/operation-categories', {params: parameters})
}

const destroy = k_operation => {
  return axios.delete('api/operation-item/'+k_operation)
}

const get = k_operation => {
  return axios.get('api/operation-item/'+k_operation)
}

const post = parameters => {
  return axios.post('api/operation-item', parameters)
}

const put = (k_operation, parameters) => {
  return axios.put('api/operation-item/'+k_operation, parameters)
}

export default {
  categoriesGet,
  destroy,
  get,
  post,
  put,
}