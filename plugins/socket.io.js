import io from 'socket.io-client'

let socket

if (process.env.NODE_ENV === 'development') {
  socket = io('http://localhost:3000')
} else {
  socket = io('https://juriz-spotify-quiz.herokuapp.com')
}

export default socket
