const t = require('tap')
const lib = require('../src/index')
t.matchSnapshot(
  lib({
    clientId: 'your client id',
    clientSecret: 'your client secret',
    baseURL: 'http://localhost:3000/',
    redirectPath: '/callback/',
    scope: 'scopes',
  }),
  'output',
)
