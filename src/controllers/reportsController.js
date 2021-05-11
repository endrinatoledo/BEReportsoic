const { ReasonPhrases, StatusCodes,  getReasonPhrase,  getStatusCode} = require('http-status-codes')
const Sequelize = require('sequelize')
const models = require('../models')
const Op = Sequelize.Op


function getAllReports(req, res, next) {

    models.reportsModel.findAll()
    .then((reports) => {
      res.status(StatusCodes.OK).json(reports)
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
  }  
  
  function getAddReport(req, res, next) {

      if (!req.body.repName || !req.body.repCompany || !req.body.repUrl || !req.body.repStatus || req.body.roles.length <= 0) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});
      
      models.reportsModel.findOne({
        where: {
          repUrl: req.body.repUrl
        }
      })
      .then((report) => {

        if(report){

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
            repId: report.repId
            }
          })
          .then((rolReport) => {
            let resultReport={
              nameReport:'',
              companyReport:'',
              rolesReport:''
            }
            if(rolReport){

              for(let i=0; i<rolReport.length; i++){
                resultReport={
                  status:0,
                  nameReport:rolReport[i].reports.repName,
                  companyReport:rolReport[i].reports.repCompany,
                  rolesReport:(resultReport.rolesReport == '')?rolReport[i].roles.rolName : `${resultReport.rolesReport}, ${rolReport[i].roles.rolName}`
                }
              }

            }

            message = `URL pertenece a: ${resultReport.nameReport}, Compañia : ${resultReport.companyReport}, Roles: ${resultReport.rolesReport} `

            res.status(StatusCodes.OK).json({status: 0, message,resultReport})
          }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
            next(err)
          })  

        }else{
          models.reportsModel.create({
            repName: req.body.repName,
            repDescription: req.body.repDescription,
            repCompany: req.body.repCompany,
            repUrl: req.body.repUrl,
            repStatus: req.body.repStatus
            })
            .then((report) => {
              const listRoles = req.body.roles

                let Promises= [];
                for(let i=0; i < listRoles.length; i++){         

                  let newPromise = models.rolReportModel.create({
                    rolId: listRoles[i],
                    repId: report.repId
                  })
                  Promises.push(newPromise);

                }

                return Promise.all(Promises).then(function (result) {
                  newRoles = result;
                  message = 'Reporte creado con éxito';
                  res.status(StatusCodes.OK).json({ message, report, roles: newRoles})
                }).catch(function (err) {
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
  
  function getReportById(req, res, next){
    models.reportsModel.findOne({
      where: {
        repId: req.params.id
      }
    })
    .then((report) => {
      res.status(StatusCodes.OK).json(report)
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
  }
  
  function getUpdateReportById(req, res, next){

    models.reportsModel.findOne({
      where: {
        repUrl: req.body.repUrl,
        repId: {
          [Op.ne]: req.params.id
        }
      }
    })
    .then((report) => {

      if(report){
        return res.status(StatusCodes.OK).json({ok: false, message: 'URL ya asignado a otro reporte'})
      }else{
        let rol_
        if(req.body.repStatus == 'Activo' || req.body.repStatus == '1'){ rol_ = 1 }
        else if(req.body.repStatus == 'Inactivo' || req.body.repStatus == '0'){ rol_ = 0 }

        models.reportsModel.findOne({
          where: { repId: req.params.id }
        })
        .then((report) => {  

          if(report) {
            report.update({
                repName: (req.body.repName != null) ? req.body.repName : report.repName,
                repDescription: (req.body.repDescription != null) ? req.body.repDescription : report.repDescription,
                repCompany: (req.body.repCompany != null) ? req.body.repCompany : report.repCompany,
                repUrl: (req.body.repUrl != null) ? req.body.repUrl : report.repUrl,
                repStatus: (req.body.repStatus != null) ? rol_ : report.repStatus
            })
            .then((report_) => {
              //actualizar roles asociados

              const listRoles = req.body.roles

              models.rolReportModel.destroy({
                where: {
                  repId: report_.repId
                }
              }).then((rolesReport) => {

                let Promises= [];
                for(let i=0; i < listRoles.length; i++){         

                  let newPromise = models.rolReportModel.create({
                    rolId: listRoles[i],
                    repId: report_.repId
                  })
                  Promises.push(newPromise);

                }

                return Promise.all(Promises).then(function (result) {
                  newRoles = result;
                  message = 'Reporte Editado con éxito';
                  res.status(StatusCodes.OK).json({ message, report_, roles: newRoles})
                }).catch(function (err) {
                  message = err
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
                    next(err)
                })

                

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
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })

  
  }


function getAllActivesReport(req, res, next) {
    models.reportsModel.findAll({
      where: {
        repStatus: 1
      }
    })
    .then((reports) => {
      res.status(StatusCodes.OK).json(reports)
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
  }
  const getActivesReportsByRol = async (req, res, next) => {

    try {

      let rolReport = await models.rolReportModel.findAll({
        include: [ {
              model: models.reportsModel,
              as: 'reports',
              where: {repStatus: 1},
              require: true,
              
          }],
          where: { rolId: req.params.rol }
          
      }).catch((err) => {
        throw err;
        });
        
        let business_ =  await models.rolReportModel.findAll({
          include: [ {
            model: models.reportsModel,
            attributes: ['repCompany'],
            where: {
              repStatus: 1
            },
            group: 'repCompany',
            as:'reports'
                
            }],
            where: { rolId: req.params.rol }            
        }).catch((err) => {
          throw err;
          });
          let business

          let result =[]
          if(business_.length !== 0){
            for(let i = 0; i<business_.length; i++){
              result.push(business_[i].reports.repCompany)
            }

            business = result.filter((item,index)=>{
                return result.indexOf(item) === index;
              })

          }


        if(rolReport.length !== 0){
          let reports=[]

          for(let i = 0; i<rolReport.length; i++){
            reports.push(rolReport[i].reports)
          }
          
          dataresp={
            business,
            reports
                    }
                   
          res.status(StatusCodes.OK).json(dataresp)

        }else{
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message:'No hay datos para mostrar' });
        }

    }catch (err) {
      message = err;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err);
    }


  }
  const getActivesReportByCompanyByRol = async (req, res, next) => {

    try{

      let rolReport = await models.rolReportModel.findAll({
        include: [ {
              model: models.reportsModel,
              as: 'reports',
              where: { repStatus: 1, repCompany:req.params.company},
              require: true              
          }],
          where: { rolId: req.params.rol }                  
      }).catch((err) => {
        throw err;
        });

        if(rolReport.length !== 0){
          let reports=[]

          for(let i = 0; i<rolReport.length; i++){

            reports.push({
              key:i,
              repId:rolReport[i].reports.repId,
              repName:rolReport[i].reports.repName,
              repDescription:rolReport[i].reports.repDescription,
              repCompany:rolReport[i].reports.repCompany,
              repUrl:rolReport[i].reports.repUrl,
              repStatus:rolReport[i].reports.repStatus,
              })
          }
                   
          res.status(StatusCodes.OK).json(reports)

        }else{
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message:'No hay datos para mostrar' });
        }

    }catch (err) {
      message = err;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
      next(err);
    }

  }
  
  function deleteReportById(req, res, next) {

    models.rolReportModel.destroy({      
      where: {
          repId: req.params.id
        }        
      }).then((rowsDeleted) => {  
      if(rowsDeleted > 0) {
        // eliminar reporte
        models.reportsModel.destroy({      
          where: {
              repId: req.params.id
            }        
          }).then((rows_Deleted) => {
            if (rows_Deleted > 0) {
              res.status(StatusCodes.OK).json(rows_Deleted)
            } else {
              return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar Reporte`})  
            }
          }, (err) => {
            message = err
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
            next(err)
          })

      }else{
        return res.status(StatusCodes.OK).json({ok: false, message: `Error al eliminar asociacion de roles`})  
      }
    }, (err) => {
      message = err
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })    
  }

  const getReportsRol = async (req, res, next) => {

    try {


      
      let reports = await models.reportsModel.findAll().catch((err) => {
        throw err;
      });
      let rolReport = await models.rolReportModel.findAll({
                include: [ {
                      model: models.rolesModel,
                      attributes: ['rolName'],
                      as: 'roles',
                      require: true
                  }]
              }).catch((err) => {
        throw err;
      });

      if (reports && rolReport) {

        let result = []
        for(let i=0; i < reports.length; i++){
          result.push({
            key:i,
            repId:reports[i].repId,
            repName:reports[i].repName,
            repDescription:reports[i].repDescription,
            repCompany:reports[i].repCompany,
            repUrl:reports[i].repUrl,
            repStatus:reports[i].repStatus,
            nameRoles:''
            })
          for(let j=0; j < rolReport.length; j++){
            if(rolReport[j].repId==reports[i].repId){
               result[i].nameRoles =
               (result[i].nameRoles == '' ? rolReport[j].dataValues.roles.dataValues.rolName : result[i].nameRoles + ', ' + rolReport[j].dataValues.roles.dataValues.rolName)
            }
          }
        }

      res.status(StatusCodes.OK).json(result)

      } else {
        message = "Sin reportes para mostrar";
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
      }
    } catch (err) {
      message = err;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
      next(err);
    }

  };

  module.exports = {
    getAllReports,
    getAddReport,
    getUpdateReportById,
    getReportById,
    getAllActivesReport,
    getActivesReportsByRol,
    getActivesReportByCompanyByRol,
    deleteReportById,
    getReportsRol
  }