'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      Doctor.belongsTo(models.User, { foreignKey: 'userId' });
      Doctor.belongsToMany(models.Disease, {
        through: models.DoctorDisease,
        foreignKey: 'doctorId'
      });
      Doctor.hasMany(models.Appointment, { foreignKey: 'doctorId' });
    }
  }
  Doctor.init({
    userId: DataTypes.INTEGER,
    specialization: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Doctor',
  });
  return Doctor;
};
