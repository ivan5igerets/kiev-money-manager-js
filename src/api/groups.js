import axios from '@/api/axios'

const get = parameters => {
  return axios.get('api/group-list', {params: parameters})
}

export default {
  get
}