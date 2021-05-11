module.exports = (sequelize, DataTypes) => {
  const rolesModel = sequelize.define('rolesModel',
    {
      rolId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'rol_id'
      },

      rolName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'rol_name'
      },
      rolStatus: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'rol_status'
      }
    }, {
      tableName: 'roles',
      timestamps: false
    }
  ) 

  rolesModel.associate = function (models) {

    rolesModel.hasMany(models.rolReportModel, {
      as: 'rol_report',
      foreignKey: 'rolId'
    })
  }

  return rolesModel
}
