class Users {
    constructor() {
        this.users = [];
    }

    addUser(user) {
        this.users = [...this.users, user]
    }
    
    removeUser(id) {
        this.users = this.users.filter(user => user.socketId !== id)
    }
}

export { Users }