module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Messages',
      [
        {
          parent_id: 0,
          user_id: 1,
          title: 'hello world',
          body: 'this first message should use markdown',
          file: 'hello.jpg',
          createdAt: new Date('August 19, 2019 23:16:30'),
          updatedAt: new Date('August 19, 2019 23:16:30'),
        },
        {
          parent_id: 1,
          user_id: 2,
          title: 'answering to hello world',
          body: 'hello world is great but what about threadts',
          file: 'hello.jpg',
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
