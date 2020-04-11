module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.addColumn(
      'Messages', // name of Source model
      'user_id', // name of the key we're adding
      {
        type: DataTypes.NUMBER,
        references: {
          model: 'Users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Messages', // name of Source model
      'user_id', // key we want to remove
    )
  },
}
