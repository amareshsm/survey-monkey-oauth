const http = require('http')
const port = 3000
const hostname = '127.0.0.1'
const lib = require('survey-monkey-oauth')({
  clientId: 'your client id',
  clientSecret: 'your client secret',
  baseURL: 'http://localhost:3000/',
  redirectPath: '/callback/',
  scope: '',
})
// on success
lib.on('success', (tokenRes, res) => {
  console.log('success !!!', tokenRes.data)
  res.end('token successfully generated')
})

// on failure
lib.on('error', (errorRes, res) => {
  console.log('error', errorRes)
})

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  if (req.url.match(/login/)) return lib.authorize(req, res)
  if (req.url.match(/callback/)) return lib.generateToken(req, res)
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
