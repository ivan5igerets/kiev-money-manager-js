import axios from '@/api/axios'

const get = parameters => {
  return axios.get('api/group-category-list', {params: parameters})
}

export default {
  get
}