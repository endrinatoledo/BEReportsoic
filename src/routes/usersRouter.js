const express = require('express')
const PropertiesReader = require('properties-reader')

const usersController = require('../controllers/usersControllers')

const properties = PropertiesReader('./src/props/common.properties')
 
const uriAllUsers = properties.get('routes.api.users')
const uriUser = properties.get('routes.api.user')
const uriUserById = properties.get('routes.api.userById')
const uriUserByEmail = properties.get('routes.api.userByEmail')
const uriLogIn = properties.get('routes.api.login') 
const UriUpdatePasswordById  = properties.get('routes.api.updatePassword') 

const userRouter = express.Router()

userRouter.route(uriAllUsers)
  .get(usersController.getAllUsers)  

userRouter.route(uriUser)
  .post(usersController.getAddUser)


userRouter.route(uriUserById)  
  .put(usersController.getUpdateUserById)   
  .get(usersController.getUserById) 
  .delete(usersController.deleteUserById)  

userRouter.route(uriUserByEmail)
  .post(usersController.getUserByEmail)  
 
userRouter.route(uriLogIn)
  .post(usersController.getLogIn) 
  
userRouter.route(UriUpdatePasswordById)  
  .put(usersController.getUpdatePasswordById)    

module.exports = userRouter