module.exports = (sequelize, DataTypes) => {
  const rolReportModel = sequelize.define('rolReportModel',
    {
      rorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'ror_id'
      },

      rolId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'rol_id'
      },
      repId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'rep_id'
      }
    }, {
      tableName: 'rol_report',
      timestamps: false
    }
  ) 
 
  rolReportModel.associate = function (models) {
    rolReportModel.belongsTo(models.rolesModel, {
      as: 'roles',
      foreignKey: 'rolId'
    })

    rolReportModel.belongsTo(models.reportsModel, {
      as: 'reports',
      foreignKey: 'repId'
    })
  }  

  return rolReportModel
}
