const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  id: state => state.user.id,
  violation: state => state.user.violation,
  email: state => state.user.email,
  phone: state => state.user.phone,
  userId: state => state.user.userId
}
export default getters
