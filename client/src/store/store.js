import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    token: sessionStorage.getItem('token') || '',
    user: JSON.parse(sessionStorage.getItem('user')) || ''
  },
  getters: {
    isUserLoggedIn (state) {
      return state.token !== '' && state.token !== 'null' && state.token !== null
    }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
    setToken ({commit}, token) {
      sessionStorage.setItem('token', token)
      commit('setToken', token)
    },
    setUser ({commit}, user) {
      sessionStorage.setItem('user', JSON.stringify(user))
      commit('setUser', user)
    }
  }
})

export default store
