const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const app = express()
const authRequired = require('./src/middleware/auth-required.middleware')

require('express-ws')(app)

app.use(bodyParser.json())
app.use(cors({
  origin: 'http://localhost:4200'
}))

app.use((req, res, next) => {
  if (process.env.DEBUG) {
    console.log('Requested', req.method, req.originalUrl)
  }
  next()
})

app.use('/api/info', authRequired, require('./src/routes/info'))
app.use('/api/downloads', authRequired, require('./src/routes/downloads'))
app.use('/api/files', authRequired, require('./src/routes/files'))
app.use('/api/streams', authRequired, require('./src/routes/streams'))

// Must be public - resource will redirect to a client page which handles token transmission 
app.use('/api/share', bodyParser.urlencoded({ extended: true }), require('./src/routes/share'))

app.get('*.*', express.static('/usr/src/frontend/dist/frontend'))
app.all('*', function (req, res) {
  res.status(200).sendFile(`/`, {root: '/usr/src/frontend/dist/frontend'})
})

const port = process.env.PORT || 3009
app.listen(port)
console.log(`Lisitening on port ${port}`)