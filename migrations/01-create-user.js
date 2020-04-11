module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      login: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      secret: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    })
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('Users')
  },
}
