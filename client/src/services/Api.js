import axios from 'axios'
import store from '@/store/store'

export default () => {
  return axios.create({
    baseURL: 'http://localhost:8081/',
    auth: {
      username: store.state.user.id,
      password: store.state.user.password
    }
  })
}
