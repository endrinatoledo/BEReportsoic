const { ReasonPhrases, StatusCodes,  getReasonPhrase,  getStatusCode} = require('http-status-codes')
const Sequelize = require('sequelize')
const models = require('../models')
const password = require('../utils/generatePassword')
const encryptPasswprd = require('../utils/encryptPassword');
const encbcrypt = require('../utils/bcrypt');
const encrypEmail = require('../utils/encryptJs')
const {encryptPassword, comprarePassword} = require('../utils/bcrypt');
const config = require('../utils/config.json');
const jwt = require('jsonwebtoken');
const Op = Sequelize.Op

function getAllUsers(req, res, next) {
  models.usersModel.findAll({
    include: [
      {
          model: models.rolesModel,
          as: 'roles',
          require: true
      }
  ]
  })
  .then((users) => {
    if(users){
        
      let result = []
        for(let i=0; i < users.length; i++){

          result.push({ 
            key:i,       
            rolId:users[i].rolId,
            usrCompany:users[i].usrCompany,
            usrEmail:users[i].usrEmail,
            usrId:users[i].usrId,
            usrLastName:users[i].usrLastName,
            usrName:users[i].usrName,
            usrStatus:users[i].usrStatus,
            // usrPassword:users[i].usrPassword,
            rol:users[i].roles.rolName,
            
            })
        }
        res.status(StatusCodes.OK).json(result)

    }else{
        message = "Sin usuarios para mostrar";
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
    }

    
  }, (err) => {
    message = err
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
    next(err)
  })
}


const getAddUser = async (req, res, next) => {

    let rol = ''
    if (!req.body.usrName || !req.body.usrLastName || !req.body.usrEmail || !req.body.usrCompany || !req.body.usrStatus || !req.body.usrRol) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});
    if(req.body.usrName == 'Registro en proceso' || req.body.usrLastName == 'Registro en proceso' || req.body.usrCompany == 'Registro en proceso'){ rol = 11}
    try {
      let password = req.body.usrPassword

      let user = await models.usersModel.findOne({
        where: { usrEmail: req.body.usrEmail }
  
      }).catch((err) => {
        throw err; 
      });
      if (user){
        return res.status(StatusCodes.OK).json({ok: false, message: 'Email ya se encuentra registrado'})
      }else{ 
        models.usersModel.create({
          usrName: req.body.usrName,
          usrLastName: req.body.usrLastName,
          usrEmail: req.body.usrEmail,
          usrCompany: req.body.usrCompany,
          usrStatus: req.body.usrStatus, 
          rolId:((rol == '')? req.body.usrRol: rol),
          // usrPassword:req.body.usrPassword
          usrPassword:encbcrypt.encryptPWD(req.body.usrPassword)
        })
        .then((user) => {
          message = 'Usuario creado con éxito';
          res.status(StatusCodes.OK).json({ok: true,user, message})
        }, (err) => {
          message = err
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
          next(err)
        })
      }

    } catch (err) {
      message = err;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
      next(err);
    }
    
    

}

function getUserById(req, res, next){
  models.usersModel.findOne({
    where: {
      usrId: req.params.id
    }
  })
  .then((user) => {
    res.status(StatusCodes.OK).json(user)
  }, (err) => {
    message = err
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
    next(err)
  })
}

function getUpdateUserById(req, res, next){

  models.usersModel.findOne({
    where: {
      usrEmail: req.body.usrEmail,
      usrId: {
        [Op.ne]: req.params.id
      }
    }
  })
  .then((user) => {

    if(user){
      return res.status(StatusCodes.OK).json({ok: false, message: 'Email ya se encuentra registrado'})
    }else{
      let status_
      if(req.body.usrStatus == 'Activo' || req.body.usrStatus == '1'){status_ = 1 }
      else if(req.body.usrStatus == 'Inactivo' || req.body.usrStatus == '0'){ status_ = 0 }

      models.usersModel.findOne({
        where: {
          usrId: req.params.id          
        }
      }).then((user) => {

            user.update({
              usrName: (req.body.usrName != null) ? req.body.usrName : user.usrName,
              usrLastName: (req.body.usrLastName != null) ? req.body.usrLastName : user.usrLastName,
              usrEmail: (req.body.usrEmail != null) ? req.body.usrEmail : user.usrEmail,
              usrCompany: (req.body.usrCompany != null) ? req.body.usrCompany : user.usrCompany,
              usrStatus: status_,
              rolId: (req.body.rolId != null) ? req.body.rolId : user.rolId,
            })
            .then((user) => {
              message = 'Usuario editado con éxito';
              res.status(StatusCodes.OK).json({user, message})
            }, (err) => {
              message = err
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
              next(err)
            })
          }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
            next(err)
          })


    }

  }, (err) => {
    message = err
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
    next(err)
  })

}

const getUpdatePasswordById = async (req, res, next) =>{

  try{

    let password
  if(req.body.usrPasswordDefault == true){
    password = process.env.DEFAULTPASSWORD

  }else{
    if (!req.body.usrPassword){
      return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});
    }else{

      password = req.body.usrPassword
    }
  } 
    let user = await models.usersModel.findOne({
      where: { usrId: req.params.id }

    }).catch((err) => {
      throw err;
    });

    if (user){
      user.update({ 
        usrPassword: encbcrypt.encryptPWD(password)
        // usrPassword: req.body.usrPassword
      })
      .then((user) => {
        message = 'Contraseña actualizada con éxito';
        res.status(StatusCodes.OK).json({ok: true,user, message})
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ok: false,message})
        next(err)
      })      

    }else{
      return res.status(StatusCodes.OK).json({ok: false, message: 'Usuario no Encontrado'})
    }

  } catch (err) {
    message = err;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
    next(err);
  }

  
  
}

function getUserByEmail(req, res, next){


  const {usrEmail} = req.body;
  models.usersModel.findOne({
    where: {
      usrEmail: usrEmail
    }
  })
  .then((user) => {

    if(user !== null){
      if(user.usrStatus !== 1){
        message = `Usuario Inactivo`
      }else{

        let user_ = {
          usrId:user.usrId,
          usrName:user.usrName,
          usrLastName:user.usrLastName,
          usrEmail:user.usrEmail,
          usrCompany:user.usrCompany,
          usrStatus:user.usrStatus,
          rolId:user.rolId,
          usrPassword:user.usrPassword,
          token: jwt.sign({ sub: user.usrId }, config.secret)

        }

        res.status(StatusCodes.OK).json(user_)
      }
    }else{
      res.status(StatusCodes.OK).json(user)
    }    
    
  }, (err) => {
    message = err
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
    next(err)
  })
} 


function deleteUserById(req, res, next) {

  models.usersModel.destroy({      
    where: {
      usrId: req.params.id
      }        
    }).then((rowsDeleted) => {  
    if(rowsDeleted > 0) {
      return res.status(StatusCodes.OK).json({ok: false, message: `Usuario eliminado con éxito`})  
    }else{
      return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar usuario`})  
    }
  }, (err) => {
    message = err
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
    next(err)
  })    
}

const getLogIn = async (req, res, next) =>{

  if (!req.body.email || !req.body.password) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});
    
    try {

      let user = await models.usersModel.findOne({
        where: { usrEmail: req.body.email }
  
      }).catch((err) => {
        throw err;
      });

      if ( user == null || user == undefined || user == ''){
        return res.status(StatusCodes.OK).json({ok: false, message: 'Usuario no registrado'})
      }else{

        if(user.usrStatus==0){
          return res.status(StatusCodes.OK).json({ok: false, message: 'Usuario Inactivo'})
        }else{

          if(comprarePassword(user.usrPassword, req.body.password) === true){
            // if(user.usrPassword== req.body.password){
            let user_ = {
              usrId:user.usrId,
              usrName:user.usrName,
              usrLastName:user.usrLastName,
              usrEmail:user.usrEmail,
              usrCompany:user.usrCompany,
              usrStatus:user.usrStatus,
              rolId:user.rolId,
              usrPassword:user.usrPassword,
              token: jwt.sign({ sub: user.usrId }, config.secret)

            }
            res.status(StatusCodes.OK).json({ok: true, user_})
          }else{
            return res.status(StatusCodes.OK).json({ok: false, message: 'Contraseña Incorrecta'})
          }

        }

      }

    } catch (err) {
      message = err;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
      next(err);
    }


} 
module.exports = {
    getAllUsers,
    getAddUser,
    getUpdateUserById,
    getUserById,
    getUserByEmail,
    deleteUserById,
    getLogIn,
    getUpdatePasswordById
}