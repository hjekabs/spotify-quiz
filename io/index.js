import http from 'http'
import socketIO from 'socket.io'
import  {Users}  from "../utils/users";

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
        socket.to("lobby").emit("ready-users", users.users)
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