module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      // uuid: {
      //   type: DataTypes.UUID,
      //   // defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   autoIncrement: false,
      // },
      login: DataTypes.STRING,
      // secret: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {},
  )
  User.associate = function(models) {
    // User.hasMany(models.Message, {foreignKey: 'user_id'})
  }
  return User
}
