export default function() {
  window.onbeforeunload = function() {
    console.log('update session storage')
    const user = JSON.parse(sessionStorage.getItem('user'))
    delete user.socketId
    sessionStorage.setItem('user', JSON.stringify(user))
  }
}
