import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    id: '',
    role: '', // 添加role属性
    violation: '', // 添加violation属性
    email: '', // 添加email属性
    phone: '', // 添加phone属性
    userId: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState()) // 重置state时也重置role
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => { // 添加设置role的mutation
    state.role = role
  },
  SET_VIOLATION: (state, violation) => {
    state.violation = violation
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  setAvatar({ commit }, avatarUrl) {
    commit('SET_AVATAR', avatarUrl) // 调用 mutation 更新头像
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ name: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_ROLE', data.role) // 提取并设置role
        commit('SET_USER_ID', data.userId)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, role, id, violation, userId } = data
        commit('SET_ID', id)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLE', role) // 设置role
        commit('SET_VIOLATION', violation)
        commit('SET_USER_ID', userId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove token first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove token first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
