'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definisikan asosiasi one-to-one: Satu UserProfile hanya dimiliki oleh satu User.
      UserProfile.belongsTo(models.User, { foreignKey: 'userId' });
    }

    // Menambahkan instance method/getter untuk mendapatkan nama lengkap
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    }
  }
  UserProfile.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    gender: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};
