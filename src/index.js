const axios = require('axios')
let url = require('url')
let crypto = require('crypto')
let events = require('events')
let qs = require('qs')

module.exports = function (params) {
  let state = crypto.randomBytes(8).toString('hex')
  if (!params.redirectURI)
    params.redirectURI = 'http://localhost:3000/callback/'
  if (typeof params.scope === 'undefined')
    params.scope = 'surveys_read'
  let emitter = new events.EventEmitter()

  function login(req, res) {
    let u =
      'https://api.surveymonkey.com/oauth/authorize' +
      '?client_id=' +
      params.clientId +
      '&redirect_uri=' +
      params.redirectURI +
      '&response_type=code' +
      (params.scope ? '&scope=' + params.scope : '') +
      '&state=' +
      state
    res.statusCode = 302
    res.setHeader('location', u)
    res.end()
  }

  function callback(req, resp) {
    var query = url.parse(req.url, true).query
    var code = query.code
    if (!code)
      return emitter.emit(
        'error',
        { error: 'missing oauth code' },
        resp,
      )
    let data = qs.stringify({
      client_secret: `${params.clientSecret}`,
      code: `${code}`,
      redirect_uri: `${params.redirectURI}`,
      client_id: `${params.clientId}`,
      grant_type: `authorization_code`,
    })
    let config = {
      method: 'post',
      url: 'https://api.surveymonkey.com/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    }
    console.log('config', config)
    axios(config)
      .then(function (response) {
        console.log(response.data)
        return emitter.emit('success', response, resp)
      })
      .catch(function (error) {
        console.log(error)
        return emitter.emit('error', error, resp)
      })
  }

  function testfn(param) {
    console.log(param)
    return emitter.emit('Testing', { data: param })
  }

  emitter.login = login
  emitter.testfn = testfn
  emitter.callback = callback
  return emitter
}
