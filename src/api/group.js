import axios from '@/api/axios'

const destroy = (k_category_group, parameters) => {
  return axios.delete('api/group-item/'+k_category_group, {params: parameters})
}

const get = k_category_group => {
  return axios.get('api/group-item/'+k_category_group)
}

const post = parameters => {
  return axios.post('api/group-item', parameters)
}

const put = (k_category_group, parameters) => {
  return axios.put('api/group-item/'+k_category_group, parameters)
}

export default {
  destroy,
  get,
  post,
  put,
}