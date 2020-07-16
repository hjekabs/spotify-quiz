class GameUsers {
  constructor() {
    this.users = []
  }

  getUsers() {
    return this.users
  }

  addUser(user) {
    this.users = [...this.users, user]
  }

  removeUser(id) {
    this.users = this.users.filter(user => user.socketId !== id)
  }

  userPin(id) {
    const user = this.users.filter(user => user.socketId === id)[0]

    if (user) {
      return user.pin
    } else {
      return undefined
    }
  }
}

export { GameUsers }
