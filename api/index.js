import express from 'express'

 const app = express()

 app.all('/test/', (req, res) => {
   res.send('Success! 🎉\n')
 })

 module.exports = {
   path: '/api/',
   handler: app
 }
