'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = bcrypt.hashSync('password', 10);

    const doctors = [
      { username: 'doctor_general_1', email: 'general1@mail.com', specialization: 'General' },
      { username: 'doctor_general_2', email: 'general2@mail.com', specialization: 'General' },
      { username: 'doctor_surgeon_1', email: 'surgeon1@mail.com', specialization: 'Surgeon' },
      { username: 'doctor_surgeon_2', email: 'surgeon2@mail.com', specialization: 'Surgeon' },
      { username: 'doctor_cardio_1', email: 'cardio1@mail.com', specialization: 'Cardiologist' },
      { username: 'doctor_cardio_2', email: 'cardio2@mail.com', specialization: 'Cardiologist' },
      { username: 'doctor_pedia_1', email: 'pedia1@mail.com', specialization: 'Pediatrician' },
      { username: 'doctor_pedia_2', email: 'pedia2@mail.com', specialization: 'Pediatrician' },
      { username: 'doctor_neuro_1', email: 'neuro1@mail.com', specialization: 'Neurologist' },
      { username: 'doctor_neuro_2', email: 'neuro2@mail.com', specialization: 'Neurologist' }
    ];

    // USERS
    await queryInterface.bulkInsert(
      'Users',
      doctors.map(d => ({
        username: d.username,
        email: d.email,
        password: hashedPassword, // ✅ HASHED
        role: 'doctor',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    // Ambil user
    const users = await queryInterface.sequelize.query(
      `SELECT id, email FROM "Users" WHERE email IN (:emails)`,
      {
        replacements: { emails: doctors.map(d => d.email) },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    // DOCTORS
    await queryInterface.bulkInsert(
      'Doctors',
      users.map(u => {
        const doc = doctors.find(d => d.email === u.email);
        return {
          userId: u.id,
          specialization: doc.specialization,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Doctors', null, {});
    await queryInterface.bulkDelete('Users', { role: 'doctor' }, {});
  }
};
