const express = require('express')
const PropertiesReader = require('properties-reader')

const reportsController = require('../controllers/reportsController')

const properties = PropertiesReader('./src/props/common.properties')


const uriAllReports = properties.get('routes.api.reports')
const uriReport = properties.get('routes.api.report')
const uriReportById = properties.get('routes.api.reportById')
const uriAllActiveReports = properties.get('routes.api.activeReports')
const uriActivesReportsByRol = properties.get('routes.api.activeReportsByRol')
const uriActivesReportByCompanyByRol = properties.get('routes.api.activesReportByCompanyByRol')
const uriReportsRol = properties.get('routes.api.reportsRol')

const reportRouter = express.Router()

reportRouter.route(uriAllReports)
  .get(reportsController.getAllReports)  

  reportRouter.route(uriReport)
  .post(reportsController.getAddReport)


  reportRouter.route(uriReportById)  
  .put(reportsController.getUpdateReportById) 
  .get(reportsController.getReportById) 
  .delete(reportsController.deleteReportById) 
  
  
reportRouter.route(uriAllActiveReports)
  .get(reportsController.getAllActivesReport)  

reportRouter.route(uriActivesReportsByRol)  
  .get(reportsController.getActivesReportsByRol) 

reportRouter.route(uriActivesReportByCompanyByRol)  
  .get(reportsController.getActivesReportByCompanyByRol) 

  reportRouter.route(uriReportsRol)  
  .get(reportsController.getReportsRol) 
  

module.exports = reportRouter