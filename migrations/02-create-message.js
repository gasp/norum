module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Messages', {
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
      body: {
        type: DataTypes.TEXT,
      },
      file: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Messages')
  },
}
