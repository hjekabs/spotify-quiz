import io from 'socket.io-client'
console.log(process.env)

const socket = io(process.env.BASE_URL || 'http://localhost:3000')
export default socket
