require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const winston = require('winston')

const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');

const PropertiesReader = require('properties-reader')

const properties = PropertiesReader('./src/props/common.properties')
const usersRouter = require('./src/routes/usersRouter')
const rolesRouter = require('./src/routes/rolesRouter')
const reportsRouter = require('./src/routes/reportsRouter')
const rolReportsRouter = require('./src/routes/rolReportRouter')

const app = express()
app.use(express.json())
app.use(express.Router())
app.use(cors())
app.use(jwt());

require('./src/models/index')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Setting up loggers.
const root = properties.get('routes.api.index')
const version = properties.get('routes.api.version')
const PORT = process.env.PORT || 2001

app.use(version, usersRouter)
app.use(version, rolesRouter)
app.use(version, reportsRouter)
app.use(version, rolReportsRouter)
app.use(errorHandler);

app.listen( PORT, ()=> {
    console.log(`Express app listening on port ${PORT}`)
  })

  
  