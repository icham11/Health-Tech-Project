
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Diseases', [
      {
        name: 'Flu',
        description: 'Penyakit yang disebabkan oleh virus influenza.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Demam Berdarah',
        description: 'Penyakit yang disebabkan oleh virus dengue yang ditularkan melalui nyamuk Aedes aegypti.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tifus',
        description: 'Penyakit yang disebabkan oleh bakteri Salmonella typhi.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Diseases', null, {});
  }
};
