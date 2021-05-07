import axios from '@/api/axios'

// axios.defults.

const updateProfile = parameters => {
    return axios.put('api/user/profile', parameters)
}

const settings = credentials => {
  return axios.put('api/user/settings', credentials)
}

const changePassword = credentials => {
  return axios.put('api/user/password', credentials)
}

export default {
  updateProfile,
  settings,
  changePassword
}