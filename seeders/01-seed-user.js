module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          uuid: 'admin',
          login: 'admin',
          secret: 'karaboudjan',
          createdAt: new Date('August 19, 2019 23:15:30'),
          updatedAt: new Date('August 19, 2019 23:15:30'),
        },
        {
          uuid: 'gasp',
          login: 'gasp',
          secret: 'secret',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  },
}
