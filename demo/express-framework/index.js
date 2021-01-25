const express = require('express')
const app = express()
const port = 3000
const lib = require('survey-monkey-oauth')({
  clientId: 'your client id',
  clientSecret: 'your client secret',
  baseURL: 'http://localhost:3000/',
  redirectPath: '/callback/',
  scope: '',
})

// on success
lib.on('success', (tokenRes, res) => {
  console.log('success', tokenRes.data)
  res.end('token successfully generated')
})

// on failure
lib.on('error', (errorRes, res) => {
  console.log('error', errorRes)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/login/', (req, res) => {
  lib.authorize(req, res)
})
app.get('/callback/', (req, res) => {
  lib.generateToken(req, res)
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
