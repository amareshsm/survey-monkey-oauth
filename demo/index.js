const http = require('http')
const port = 3000
const hostname = '127.0.0.1'
const lib = require('survey-monkey-oauth')({
  clientId: 'your client id',
  clientSecret: 'your secret key',
  redirectURI: 'http://localhost:3000/callback/',
})
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')

  //on success
  lib.on('success', (tokenRes, tokenReq) => {
    console.log('success', tokenRes.data)
    res.end('token successfully generated')
  })

  //on failure
  lib.on('error', (res, req) => {
    console.log('error', res, req)
  })

  if (req.url.match(/login/)) {
    return lib.login(req, res)
  }
  if (req.url.match(/callback/)) {
    return lib.callback(req, res)
  }

  if (req.url.match(/test/)) {
    lib.on('Testing', (data) => {
      console.log('test route', data)
    })
    lib.testfn('sample data')
    res.end('testing')
  }
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
