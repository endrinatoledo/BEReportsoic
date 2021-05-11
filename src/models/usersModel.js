module.exports = (sequelize, DataTypes) => {
  const usersModel = sequelize.define('usersModel',
    {
      usrId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'usr_id'
      },

      usrName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'usr_name'
      },
      usrLastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'usr_last_name'
      },
      usrEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'usr_email'
      },
      usrCompany: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'usr_company'
      },
      usrStatus: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'usr_status'
      },
      rolId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'rol_id'
      },
      usrPassword:{
        type:DataTypes.STRING(100),
        allowNull: true,
        field: 'usr_password'
      }
    }, {
      tableName: 'users',
      timestamps: false
    } 
  )

  usersModel.associate = (models) => {
    usersModel.belongsTo(models.rolesModel, {
      as: 'roles',
      foreignKey: 'rolId'
    })
  }

  return usersModel
}
