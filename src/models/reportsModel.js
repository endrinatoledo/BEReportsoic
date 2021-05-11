module.exports = (sequelize, DataTypes) => {

  const reportsModel = sequelize.define('reportsModel',
    {
      repId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'rep_id'
      },
      repName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'rep_name'
      },
      repDescription: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'rep_description'
      },
      repCompany: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'rep_company'
      },
      repUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'rep_url'
      },
      repStatus: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'rep_status'
      }
    }, {
      tableName: 'reports',
      timestamps: false
    }
  )
  reportsModel.associate = (models) => {

    reportsModel.hasMany(models.rolReportModel, {
      as: 'ReportRol',
      foreignKey: 'repId'
    })
  } 

  return reportsModel
}
