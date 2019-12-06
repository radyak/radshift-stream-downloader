const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const app = express()

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

app.use('/api/info', require('./src/routes/info'))
app.use('/api/downloads', require('./src/routes/downloads'))
app.use('/api/files', require('./src/routes/files'))
app.use('/api/streams', require('./src/routes/streams'))
app.use('/api/share', bodyParser.urlencoded({ extended: true }), require('./src/routes/share'))

app.get('*.*', express.static('/usr/src/frontend/dist/frontend'))
app.all('*', function (req, res) {
  res.status(200).sendFile(`/`, {root: '/usr/src/frontend/dist/frontend'})
})

const port = process.env.PORT || 3009
app.listen(port)
console.log(`Lisitening on port ${port}`)