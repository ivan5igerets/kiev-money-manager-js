import axios from '@/api/axios'

const destroy = k_category => {
  return axios.delete('api/category-item/'+k_category)
}

const get = k_category => {
  return axios.get('api/category-item/'+k_category)
}

const post = parameters => {
  return axios.post('api/category-item', parameters)
}

const put = (k_category, parameters) => {
  return axios.put('api/category-item/'+k_category, parameters)
}

export default {
  destroy,
  get,
  post,
  put,
}