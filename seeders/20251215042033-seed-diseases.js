"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Diseases", [
      {
        name: "Flu",
        description: "Penyakit yang disebabkan oleh virus influenza.",
        level: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Demam Berdarah",
        description:
          "Penyakit yang disebabkan oleh virus dengue yang ditularkan melalui nyamuk Aedes aegypti.",
        level: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tifus",
        description: "Penyakit yang disebabkan oleh bakteri Salmonella typhi.",
        level: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Diseases", null, {});
  },
};
