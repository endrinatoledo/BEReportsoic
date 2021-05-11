const express = require('express')
const PropertiesReader = require('properties-reader')

const rolReportController = require('../controllers/rolReportController')

const properties = PropertiesReader('./src/props/common.properties')


const uriAllRolReports = properties.get('routes.api.rolreports')
const uriRolReport = properties.get('routes.api.rolreport')
const uriRolReportById = properties.get('routes.api.rolreportById')
const uriActivesRolReportsByRol = properties.get('routes.api.rolreportsactivebyrol')
const uriActivesRolReportsByReport = properties.get('routes.api.rolreportsactivebyreport') 

const rolReportRouter = express.Router()

rolReportRouter.route(uriAllRolReports)
  .get(rolReportController.getAllRolReport)  

  rolReportRouter.route(uriRolReport)
  .post(rolReportController.getAddRolReport)


  rolReportRouter.route(uriRolReportById)  
  .put(rolReportController.getUpdateRolReportById) 
  .get(rolReportController.getRolReportById)  
  
  rolReportRouter.route(uriActivesRolReportsByRol)  
    .get(rolReportController.getRolReportActiveByRol)

  rolReportRouter.route(uriActivesRolReportsByReport)  
    .get(rolReportController.getRolReportActiveByReport)
    

module.exports = rolReportRouter