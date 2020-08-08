import http from 'http'
import socketIO from 'socket.io'
import { GameUsers, UserAnswers } from '../utils/users'

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
    const answers = new UserAnswers()

    io.on('connection', socket => {
      // user has joined the game
      socket.on('user-joined-game', function(msg) {
        const { pin, user } = msg
        socket.join(`game-${pin}`)
        global[`gameUsers-${pin}`] = new GameUsers()
        global[`gameUsers-${pin}`].addUser({
          ...user,
          socketId: socket.id,
          pin
        })

        console.log(global[`gameUsers-${pin}`].getUsers())

        // return to lobby all users
        io.to(`game-${pin}`).emit('game-ready-users', {
          allUsers: global[`gameUsers-${pin}`].getUsers(),
          user,
          socketId: socket.id,
          pin
        })
      })

      // admin clicked on game started
      socket.on('clicked-start-game', function(msg) {
        const pin = msg
        io.to(`game-${pin}`).emit('start-game')
        // create a answer class instance
        global[`answersPin-${pin}`] = new UserAnswers()
      })

      socket.on('user-answered-question', function(msg) {
        const { pin, answer } = msg
        const socketId = socket.id
        global[`answersPin-${pin}`].addAnswer({
          socketId,
          answer
        })
        // answer = {displayName, score}

        io.to(`game-${pin}`).emit('add-answered', answer)
      })

      socket.on('all-users-answered-question', function(msg) {
        const { pin, answers } = msg
        const socketId = socket.id
        const allAnswers = global[`answersPin-${pin}`].getAnswers()
        io.to(`game-${pin}`).emit('all-answered', {
          allAnswers,
          answers,
          socketId
        })
      })

      // user has diconnected
      socket.on('disconnect', function() {
        const pin = gameUsers.userPin(socket.id)
        gameUsers.removeUser(socket.id)
        io.to(`game-${pin}`).emit('game-ready-users', {
          allUsers: gameUsers.getUsers()
        })

        if (pin) {
          console.log('dsmkakdnkjasndjkasnjkdas')
          // if somebody left from the game pin it's over
          console.log('user left')

          io.to(`game-${pin}`).emit('user-left-the-game')
          if (global[`gameUsers-${pin}`]) {
            global[`gameUsers-${pin}`].removeUser(socket.id)
          }
          if (global[`answersPin-${pin}`]) {
            global[`answersPin-${pin}`].removeAnswers()
            delete global[`answersPin-${pin}`]
          }
        }
      })
    })
  })
}
