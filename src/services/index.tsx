import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_AUTH_API,
  headers: {
    Authorization: `Bearer ${Cookies.get('GeoToken')}`,
  },
})
api.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${Cookies.get('GeoToken')}`
  return config
})
export default api
