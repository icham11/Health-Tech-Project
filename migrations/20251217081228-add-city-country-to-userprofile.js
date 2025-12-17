"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("UserProfiles", "city", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("UserProfiles", "country", {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("UserProfiles", "city");
    await queryInterface.removeColumn("UserProfiles", "country");
  },
};
