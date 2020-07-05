import http from 'http'
import socketIO from 'socket.io'

export default function () {
  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => new Promise(resolve => server.listen(port || 3000, host || 'localhost', resolve))
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close))

    // Add socket.io events
    
    const users = []


    io.on('connection', (socket) => {

        console.log("connected")

      socket.on('user-logged_in', function (message) {
        console.log("In am in backed and received something")

        // add the users
        users.push(message)

        socket.broadcast.emit('logged-in-users', users)
      })
    })
  })
}