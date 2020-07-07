import express from 'express'

 const app = express()

 app.all('/test/', (req, res) => {
   res.send('Success! 🎉\n')
 })

 app.get("/spotify/login", (req, res) => {
  const scopes = encodeURIComponent("user-read-private user-read-email")
  const url = "https://accounts.spotify.com/authorize"
  const responseType = "code"
  // add this to env later
  const clientId = "f79dd1f6402b41fe8828c55654cea80a"
  const redirectUrl = encodeURIComponent("/spotify/callback")

  res.redirect(`
    ${url}?response_type=${responseType}&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUrl}
  `)

 })

 app.get("/spotify/callback", (req, res) => {
   console.log(req)
   console.log(res)
 })

 module.exports = {
   path: '/api/',
   handler: app
 }


