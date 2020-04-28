module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      parent_id: {
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      body: DataTypes.TEXT,
      file: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
    },
    {},
  )
  Message.associate = function(models) {
    // associations can be defined here
    Message.belongsTo(models.User, { foreignKey: 'user_id' })
  }
  return Message
}
