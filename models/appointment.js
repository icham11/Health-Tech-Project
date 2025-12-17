'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.User, { foreignKey: 'userId' });
      Appointment.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
      Appointment.belongsTo(models.Disease, { foreignKey: 'diseaseId' });
    }
  }
  Appointment.init({
    userId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    diseaseId: DataTypes.INTEGER,
    appointmentDate: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Appointment',
  });
  return Appointment;
};
