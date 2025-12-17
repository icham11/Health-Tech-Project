'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const doctors = await queryInterface.sequelize.query(
      `SELECT id, specialization FROM "Doctors";`
    );

    const diseases = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Diseases";`
    );

    const doctorRows = doctors[0];
    const diseaseRows = diseases[0];

    const doctorDiseases = [];

    const mapping = {
      General: ['Flu', 'Fever', 'Bronchitis', 'Anemia'],
      Surgeon: ['Appendicitis'],
      Cardiologist: ['Heart Attack', 'Hypertension'],
      Pediatrician: ['Chickenpox', 'Measles'],
      Neurologist: ['Epilepsy', 'Stroke']
    };

    doctorRows.forEach(doctor => {
      const allowedDiseases = mapping[doctor.specialization] || [];

      diseaseRows.forEach(disease => {
        if (allowedDiseases.includes(disease.name)) {
          doctorDiseases.push({
            doctorId: doctor.id,
            diseaseId: disease.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      });
    });

    await queryInterface.bulkInsert('DoctorDiseases', doctorDiseases, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('DoctorDiseases', null, {});
  }
};
