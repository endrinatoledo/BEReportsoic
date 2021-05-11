const express = require('express')
const PropertiesReader = require('properties-reader')

const rolesController = require('../controllers/rolesController')

const properties = PropertiesReader('./src/props/common.properties')


const uriAllRoles = properties.get('routes.api.roles')
const uriRol = properties.get('routes.api.rol')
const uriRolById = properties.get('routes.api.rolById')
const uriAllActiveRoles = properties.get('routes.api.activeRoles')
 
const rolRouter = express.Router()

rolRouter.route(uriAllRoles)
  .get(rolesController.getAllRoles)  

  rolRouter.route(uriRol)
  .post(rolesController.getAddRol)


  rolRouter.route(uriRolById)  
  .put(rolesController.getUpdateRolById) 
  .get(rolesController.getRolById)  
  .delete(rolesController.deleteRolById) 
  
rolRouter.route(uriAllActiveRoles)
  .get(rolesController.getAllActivesRoles)   

module.exports = rolRouter