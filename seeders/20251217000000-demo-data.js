"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("password", salt);

    // 1. Create Users (Doctors)
    const users = [
      {
        username: "dr_house",
        email: "house@mail.com",
        password: hash,
        role: "doctor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "dr_strange",
        email: "strange@mail.com",
        password: hash,
        role: "doctor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "dr_who",
        email: "who@mail.com",
        password: hash,
        role: "doctor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Users", users, {});

    const insertedUsers = await queryInterface.sequelize.query(
      `SELECT id, username FROM "Users" WHERE role = 'doctor';`
    );
    const userRows = insertedUsers[0];

    // 2. Create UserProfiles
    const profiles = userRows.map((user) => {
      let gender = "Male";
      let firstName = "Doctor";
      let lastName = "Who";

      if (user.username === "dr_house") {
        firstName = "Gregory";
        lastName = "House";
      }
      if (user.username === "dr_strange") {
        firstName = "Stephen";
        lastName = "Strange";
      }

      return {
        userId: user.id,
        firstName,
        lastName,
        dateOfBirth: new Date("1980-01-01"),
        gender,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("UserProfiles", profiles, {});

    // 3. Create Doctors
    const doctorData = userRows.map((user) => {
      return {
        userId: user.id,
        specialization: "General",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("Doctors", doctorData, {});

    const insertedDoctors = await queryInterface.sequelize.query(
      `SELECT id, "userId" FROM "Doctors";`
    );
    const doctorRows = insertedDoctors[0];

    // 4. Create Diseases
    const diseases = [
      {
        name: "Flu",
        description: "Influenza, causing fever and fatigue",
        level: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Fever",
        description: "High body temperature",
        level: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Covid-19",
        description: "Respiratory illness",
        level: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Migraine",
        description: "Severe headache",
        level: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Allergy",
        description: "Immune system reaction",
        level: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Diseases", diseases, {});

    const insertedDiseases = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Diseases";`
    );
    const diseaseRows = insertedDiseases[0];

    // 5. Create DoctorDiseases (Link)
    // Distribute diseases among doctors
    const doctorDiseases = [];

    const getDoctorByUsername = (targetUsername) => {
      const user = userRows.find((u) => u.username === targetUsername);
      if (!user) return null;
      return doctorRows.find((d) => d.userId === user.id);
    };

    // Dr House gets difficult ones + Fever
    const house = getDoctorByUsername("dr_house");
    if (house) {
      const dIds = diseaseRows
        .filter((d) => ["Covid-19", "Migraine", "Fever"].includes(d.name))
        .map((d) => d.id);
      dIds.forEach((did) => {
        doctorDiseases.push({
          doctorId: house.id,
          diseaseId: did,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }

    // Dr Strange gets weird ones + Flu
    const strange = getDoctorByUsername("dr_strange");
    if (strange) {
      const dIds = diseaseRows
        .filter((d) => ["Flu", "Allergy", "Covid-19"].includes(d.name))
        .map((d) => d.id);
      dIds.forEach((did) => {
        doctorDiseases.push({
          doctorId: strange.id,
          diseaseId: did,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }

    // Dr Who gets everything else
    const who = getDoctorByUsername("dr_who");
    if (who) {
      const dIds = diseaseRows.map((d) => d.id); // All
      dIds.forEach((did) => {
        doctorDiseases.push({
          doctorId: who.id,
          diseaseId: did,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }
    await queryInterface.bulkInsert("DoctorDiseases", doctorDiseases, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("DoctorDiseases", null, {});
    await queryInterface.bulkDelete("Diseases", null, {});
    await queryInterface.bulkDelete("Doctors", null, {});
    await queryInterface.bulkDelete("UserProfiles", null, {});
    await queryInterface.bulkDelete("Users", { role: "doctor" }, {});
  },
};
