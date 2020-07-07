import http from 'http'
import socketIO from 'socket.io'
import  {Users, GameUsers}  from "../utils/users";

export default function () {
  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => new Promise(resolve => server.listen(port || 3000, host || 'localhost', resolve))
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))

    // create the Users class
    const users = new Users()
    const gameUsers = new GameUsers()

    io.on('connection', (socket) => {

      // user logged in
      socket.on('user-logged_in', function (user) {
        users.addUser({
          ...user,
          socketId: socket.id
        })
      })

      // user entered lobby
      socket.on("user-entered-lobby", function(msg) {
        socket.join("lobby")
        io.to("lobby").emit("ready-users", users.users)
      })

      socket.on("user-joined-game", function(msg) {
        const {pin, user} = msg
        socket.join(`game-${pin}`)
        gameUsers.addUser(user)
        console.log("should be emiting?????")
        io.to(`game-${pin}`).emit("game-ready-users", {
          user: user,
          allUsers: gameUsers.users
        })
      })

      // user has diconnected
      socket.on("disconnect", function() {
        // users.removeUser(socket.id)
        // console.log("-----------------------")
        // console.log(users.users)
        console.log("user disconnected")
      })
    })
  })
}