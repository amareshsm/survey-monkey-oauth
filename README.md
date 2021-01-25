[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC) 
[![1.0](https://badge.fury.io/js/survey-monkey-streams.svg)](//npmjs.com/package/react-js-css-loaders)

# survey monkey oauth #
Oauth2 authentication tools for SurveyMonkey
## Quick overview ##
### Step 1: Configuration setup ###
```
const lib = require('survey-monkey-oauth')({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  baseURL: 'http://localhost:3000/', /* optional, default baseURL is http://localhost:3000/ */
  redirectPath: '/callback/',  /* optional, default redirectPath is /callback/ */
  scope: 'scopes',
})
```
### Step 2: Routes configuration ###
```
  if (req.url.match(/login/)) return lib.authorize(req, res)
  if (req.url.match(/callback/)) return lib.generateToken(req, res)
```

### Step 3: Listening for response ###
```
// on success
lib.on('success', (tokenRes, res) => {
  console.log('success !!!', tokenRes.data)
  res.end('token successfully generated')
})

// on failure
lib.on('error', (errorRes, res) => {
  console.log('error', errorRes)
})
```
### Usage ###  
#### [Using native-addons](https://github.com/amareshsm/survey-monkey-oauth/tree/master/demo/native-api) ####
```
const http = require('http')
const port = 3000
const hostname = '127.0.0.1'
const lib = require('survey-monkey-oauth')({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  baseURL: 'http://localhost:3000/',  /* redirect url base */
  redirectPath: '/callback/', /* redirect url pathname */
  scope: '',  /* scopes to request permissions from app users during OAuth */
})
/* on success */
lib.on('success', (tokenRes, res) => {
  console.log('success !!!', tokenRes.data)
  res.end('token successfully generated')
})

/* on failure */
lib.on('error', (errorRes, res) => {
  console.log('error', errorRes)
})

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  if (req.url.match(/login/)) return lib.authorize(req, res) /* /login - initiates oauth authentication */
  if (req.url.match(/callback/)) return lib.generateToken(req, res) /* /callback - initiates authorization process */
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
```
##### ***Note: redirectPath and callback route which initiates authorization process must be the same** #####
#### [Using express](https://github.com/amareshsm/survey-monkey-oauth/tree/master/demo/express-framework)  ####
```
const express = require('express')
const app = express()
const port = 3000
const lib = require('survey-monkey-oauth')({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  baseURL: 'http://localhost:3000/',  /* redirect url base */
  redirectPath: '/callback/', /* redirect url pathname */
  scope: '',  /* scopes to request permissions from app users during OAuth */
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
  lib.authorize(req, res)  /* /login - initiates oauth authentication */
})
app.get('/callback/', (req, res) => {
  lib.generateToken(req, res)   /* /callback - initiates authorization process */
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```
### samples available under `/demo` : ###

*  [using-node-native-addons](https://github.com/amareshsm/survey-monkey-oauth/tree/master/demo/native-api)
*  [using-express-framework](https://github.com/amareshsm/survey-monkey-oauth/tree/master/demo/express-framework) 
