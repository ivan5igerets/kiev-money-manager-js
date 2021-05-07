import axios from '@/api/axios'

const get = parameters => {
  return axios.get('api/category-list', {params: parameters})
}

export default {
  get
}