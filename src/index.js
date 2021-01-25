const axios = require('axios')
const crypto = require('crypto')
const events = require('events')
const qs = require('qs')

module.exports = function (params) {
  const emitter = new events.EventEmitter()

  function validate() {
    if (!params)
      return {
        status: false,
        msg:
          'configuration paramters - client id, client secret are missing',
      }
    if (!params.clientId)
      return { status: false, msg: 'client id is missing' }
    if (!params.clientSecret)
      return { status: false, msg: 'client secret is missing' }
    return { status: true, msg: 'success' }
  }
  const state = crypto.randomBytes(8).toString('hex')

  function authorize(req, res) {
    const result = validate()
    if (!result.status)
      return emitter.emit(
        'error',
        {
          error: result.msg,
        },
        { response: 'validation failed' },
      )
    if (!params.baseURL) params.baseURL = 'http://localhost:3000'
    if (!params.redirectPath) params.redirectPath = '/callback/'
    const redirectURL = new URL(params.redirectPath, params.baseURL)
    if (typeof params.scope === 'undefined')
      params.scope = 'surveys_read'
    const url =
      'https://api.surveymonkey.com/oauth/authorize' +
      '?client_id=' +
      params.clientId +
      '&redirect_uri=' +
      redirectURL +
      '&response_type=code' +
      (params.scope ? '&scope=' + params.scope : '') +
      '&state=' +
      state
    res.statusCode = 302
    res.setHeader('location', url)
    res.end()
  }

  function generateToken(req, resp) {
    const result = validate()
    if (!result.status)
      return emitter.emit(
        'error',
        {
          error: result.msg,
        },
        { response: 'validation failed' },
      )
    const redirectURL = new URL(params.redirectPath, params.baseURL)
    const codeURL = new URL(req.url, params.baseURL)
    const code = codeURL.searchParams.get('code')
    if (!code)
      return emitter.emit(
        'error',
        { error: 'missing oauth code' },
        resp,
      )
    const data = qs.stringify({
      client_secret: `${params.clientSecret}`,
      code: `${code}`,
      redirect_uri: `${redirectURL}`,
      client_id: `${params.clientId}`,
      grant_type: `authorization_code`,
    })
    const config = {
      method: 'post',
      url: 'https://api.surveymonkey.com/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    }
    axios(config)
      .then(function (response) {
        return emitter.emit('success', response, resp)
      })
      .catch(function (error) {
        return emitter.emit('error', error, resp)
      })
  }

  emitter.authorize = authorize
  emitter.generateToken = generateToken
  return emitter
}
