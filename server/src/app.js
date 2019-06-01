const express = require('express')
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')
const config = require('./config/config')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('./routes')(app)

sequelize.sync({force: false})
.then(() => { app.listen(config.port)
  console.log(`Server started on ${config.port}`)
})


/*

() => {
  https.createServer({
    key: fs.readFileSync('src/ssl/server.key'),
    cert: fs.readFileSync('src/ssl/server.cert')
  },

*/
