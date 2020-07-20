import http from 'http'
import socketIO from 'socket.io'
import { GameUsers } from '../utils/users'

export default function() {
  this.nuxt.hook('render:before', renderer => {
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) =>
      new Promise(resolve =>
        server.listen(port || 3000, host || 'localhost', resolve)
      )
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))

    // create the Users class
    const gameUsers = new GameUsers()

    io.on('connection', socket => {
      // user has joined the game
      socket.on('user-joined-game', function(msg) {
        console.log(socket.id)
        const { pin, user } = msg
        socket.join(`game-${pin}`)
        gameUsers.addUser({
          ...user,
          socketId: socket.id,
          pin
        })

        // return to lobby all users
        io.to(`game-${pin}`).emit('game-ready-users', {
          allUsers: gameUsers.getUsers()
        })
      })

      // user has diconnected
      socket.on('disconnect', function() {
        const pin = gameUsers.userPin(socket.id)
        gameUsers.removeUser(socket.id)
        io.to(`game-${pin}`).emit('game-ready-users', {
          allUsers: gameUsers.getUsers()
        })
      })
    })
  })
}
