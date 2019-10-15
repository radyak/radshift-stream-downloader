const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const app = express()

require('express-ws')(app)

app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())
app.use(cors({
  origin: 'http://localhost:4200'
}))

app.use('/api/info', require('./src/routes/info'))
app.use('/api/downloads', require('./src/routes/downloads'))
app.use('/api/files', require('./src/routes/files'))
app.use('/api/streams', require('./src/routes/streams'))

app.use('*', express.static('/usr/src/frontend/dist/frontend'))

const port = process.env.PORT || 3009
app.listen(port)
console.log(`Lisitening on port ${port}`)