const { ReasonPhrases, StatusCodes,  getReasonPhrase,  getStatusCode} = require('http-status-codes')
const PropertiesReader = require('properties-reader')
const Sequelize = require('sequelize')
const models = require('../models')
const Op = Sequelize.Op

function getAllRolReport(req, res, next) {
    models.rolReportModel.findAll({
      include: [
        {
            model: models.rolesModel,
            as: 'roles',
            require: true
        },
        {
          model: models.reportsModel,
          as: 'reports',
          require: true
      }
    ]
    })
    .then((rolesReports) => {
      res.status(StatusCodes.OK).json(rolesReports)
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
  }

function getAddRolReport(req, res, next) {

    if (!req.body.rolId || !req.body.repId) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});
    models.rolReportModel.create({
      rolId: req.body.rolId,
      repId: req.body.repId
      })
      .then((rolReport) => {
        res.status(StatusCodes.OK).json(rolReport)
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
        next(err)
      })

}

function getUpdateRolReportById(req, res, next){
    models.rolReportModel.findOne({
      
    where: {
        rorId: req.params.id
      }
      
    })
    .then((rolReport) => {
      if(rolReport) {
        rolReport.update({
          rolId: (req.body.rolId != null) ? req.body.rolId : rolReport.rolId,
          repId: (req.body.repId != null) ? req.body.repId : rolReport.repId
        })
        .then((rolReport) => {
          res.status(StatusCodes.OK).json(rolReport)
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

function getRolReportById(req, res, next){

    models.rolReportModel.findOne({
      include: [
        {
            model: models.rolesModel,
            as: 'roles',
            require: true
        },
        {
          model: models.reportsModel,
          as: 'reports',
          require: true
      }
    ],where: {
        rorId: req.params.id
      }
    })
    .then((rolReport) => {
      res.status(StatusCodes.OK).json(rolReport)
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
  }


  function getRolReportActiveByRol(req, res, next){

      models.rolReportModel.findOne({
        include: [
          {
              model: models.rolesModel,
              as: 'roles',
              require: true
          },
          {
            model: models.reportsModel,
            as: 'reports',
            require: true
        },
      ],where: {
        rolId: req.params.idRol
        }
      })
      .then((rolReport) => {
        res.status(StatusCodes.OK).json(rolReport)
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
        next(err)
      })
    }

    function getRolReportActiveByReport(req, res, next){

      models.rolReportModel.findAll({
        include: [
          {
              model: models.rolesModel,
              as: 'roles',
              require: true
          },
          {
            model: models.reportsModel,
            as: 'reports',
            require: true
        },
      ],where: {
        repId: req.params.idRep
        }
      })
      .then((rolReport) => {
        res.status(StatusCodes.OK).json(rolReport)
      }, (err) => {
        message = err
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
        next(err)
      })
    }

module.exports = {
    getAllRolReport,
    getAddRolReport,
    getUpdateRolReportById,
    getRolReportById,
    getRolReportActiveByRol,
    getRolReportActiveByReport
}