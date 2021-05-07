import axios from 'axios'
import {Token} from '/src/session/Token.js';

axios.defaults.baseURL = 'https://kiev-money-manager.herokuapp.com/'

axios.interceptors.request.use(config => {
    const token = Token.get()
    const authorizationToken = token ? `Bearer ${token}` : ''
    config.headers.Authorization = authorizationToken
    return config
})

export default axios