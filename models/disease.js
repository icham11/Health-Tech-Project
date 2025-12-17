'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Disease extends Model {
    static associate(models) {
      Disease.belongsToMany(models.Doctor, {
        through: models.DoctorDisease,
        foreignKey: 'diseaseId'
      });
      Disease.hasMany(models.Appointment, { foreignKey: 'diseaseId' });
    }
  }
  Disease.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Disease name is required'
        },
        notEmpty: {
          msg: 'Disease name is required'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required'
        },
        notEmpty: {
          msg: 'Description is required'
        }
      }
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Level is required'
        },
        notEmpty: {
          msg: 'Level is required'
        },
        min: {
          args: [1],
          msg: 'Level must be at least 1'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Disease',
  });
  return Disease;
};
