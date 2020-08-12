import io from 'socket.io-client'
console.log(process.env)

const socket = io('https://juriz-spotify-quiz.herokuapp.com')
export default socket
