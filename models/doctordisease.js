'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DoctorDisease extends Model {
    static associate(models) {
      DoctorDisease.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
      DoctorDisease.belongsTo(models.Disease, { foreignKey: 'diseaseId' });
    }
  }
  DoctorDisease.init({
    doctorId: DataTypes.INTEGER,
    diseaseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DoctorDisease',
  });
  return DoctorDisease;
};
