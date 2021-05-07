import axios from '@/api/axios'

const register = credentials => {
    return axios.post('api/user/register', credentials)
}

const login = credentials => {
    return axios.post('api/user/login', credentials)
}

const getUser = () => {
    return axios.get('api/user')
}

export default {
    register, 
    login,
    getUser
}