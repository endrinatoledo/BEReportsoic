const { ReasonPhrases, StatusCodes,  getReasonPhrase,  getStatusCode} = require('http-status-codes')
const PropertiesReader = require('properties-reader')
const Sequelize = require('sequelize')
const models = require('../models')
const Op = Sequelize.Op

function getAllRoles(req, res, next) {
    models.rolesModel.findAll()
    .then((roles) => {
      res.status(StatusCodes.OK).json(roles)
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
  }

function getAddRol(req, res, next) {
  
    if (!req.body.rolName || !req.body.rolStatus) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});

    models.rolesModel.findOne({
      where: {
        rolName: req.body.rolName
      }
    })
    .then((rol) => {

      if(rol){
        return res.status(StatusCodes.OK).json({ok: false, message: 'Nombre de Rol ya existe'})
      }else{
        models.rolesModel.create({
          rolName: req.body.rolName,
          rolStatus: req.body.rolStatus
        })
        .then((rol) => {
          
          res.status(StatusCodes.OK).json(rol)
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

function getUpdateRolById(req, res, next){

  models.rolesModel.findOne({
    where: {
      rolName: req.body.rolName,
      rolId: {
        [Op.ne]: req.params.id
      }
    }
  })
  .then((rol) => {

    if(rol){
      return res.status(StatusCodes.OK).json({ok: false, message: 'Nombre de Rol ya existe'})
    }else{
      let rol_
      if(req.body.rolStatus == 'Activo' || req.body.rolStatus == '1'){ rol_ = 1 }
      else if(req.body.rolStatus == 'Inactivo' || req.body.rolStatus == '0'){ rol_ = 0 }

      models.rolesModel.findOne({
        where: { rolId: req.params.id }
      })
      .then((rol) => {  
        if(rol) {
          rol.update({
              rolName: (req.body.rolName != null) ? req.body.rolName : rol.rolName,
              rolStatus: (req.body.rolStatus != null) ? rol_ : rol.rolStatus
          })
          .then((rol) => {
            res.status(StatusCodes.OK).json(rol)
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
  }, (err) => {
    message = err
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
    next(err)
  })

  }

function getRolById(req, res, next){
    models.rolesModel.findOne({
      where: {
        rolId: req.params.id
      }
    })
    .then((rol) => {
      res.status(StatusCodes.OK).json(rol)
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
  }


function getAllActivesRoles(req, res, next) {
    models.rolesModel.findAll({
      where: {
        rolStatus: 1
      }
    })
    .then((roles) => {
      res.status(StatusCodes.OK).json(roles)
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
  }

  const deleteRolById = async (req, res, next) =>  {

    try {

      let reports = await models.rolReportModel.findAll({      
        where: { rolId: req.params.id }        
        }).catch((err) => {
        throw err;
      });

      let user = await models.usersModel.findAll({      
        where: { rolId: req.params.id }        
        }).catch((err) => {
        throw err;
      });

      if(reports != [] && reports != null && reports != undefined && reports != ''){
        return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar, Rol asociado a un reporte`})
      }else 
      if(user != []  && user != null && user != undefined && user != ''){
        return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar, Rol asociado a un usuario`})
      }else{

        models.rolesModel.destroy({
          where: { rolId: req.params.id }
          }
        ).then((rowsDeleted) => {
          if (rowsDeleted > 0) {
            res.status(StatusCodes.OK).json(rowsDeleted)
          } else {
            return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar`})  
          }
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

module.exports = {
    getAllRoles,
    getAddRol,
    getUpdateRolById,
    getRolById,
    getAllActivesRoles,
    deleteRolById
}