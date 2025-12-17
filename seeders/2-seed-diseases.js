'use strict';

module.exports = {
  async up(queryInterface) {
    const diseases = [
      { name: 'Flu', level: 1 },
      { name: 'Fever', level: 1 },
      { name: 'Covid-19', level: 5 },
      { name: 'Migraine', level: 3 },
      { name: 'Allergy', level: 2 },
      { name: 'Asthma', level: 3 },
      { name: 'Diabetes', level: 4 },
      { name: 'Hypertension', level: 4 },
      { name: 'Stroke', level: 5 },
      { name: 'Heart Attack', level: 5 },
      { name: 'Bronchitis', level: 2 },
      { name: 'Pneumonia', level: 4 },
      { name: 'Appendicitis', level: 4 },
      { name: 'Anemia', level: 2 },
      { name: 'Epilepsy', level: 4 },
      { name: 'Arthritis', level: 3 },
      { name: 'Skin Infection', level: 2 },
      { name: 'Chickenpox', level: 1 },
      { name: 'Measles', level: 2 },
      { name: 'Tuberculosis', level: 5 }
    ];

    await queryInterface.bulkInsert(
      'Diseases',
      diseases.map(d => ({
        name: d.name,
        description: `${d.name} disease`,
        level: d.level,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Diseases', null, {});
  }
};
