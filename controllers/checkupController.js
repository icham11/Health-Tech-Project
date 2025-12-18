const { Disease, Doctor, Appointment, User } = require("../models");
const { Op } = require("sequelize");

class CheckupController {
  static async checkupForm(req, res) {
    try {
      const diseases = await Disease.findAll();
      const { userId } = req.session;

      let user = null;
      if (userId) {
        user = await User.findByPk(userId);
      }

      res.render("check-up", { diseases, user });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async postCheckup(req, res) {
    try {
      let { diseaseIds: symptoms } = req.body;
      const userId = req.session.userId;

      if (!Array.isArray(symptoms)) {
        symptoms = [symptoms];
      }
      symptoms = symptoms.map((s) => parseInt(s)).filter((s) => !isNaN(s));

      if (!symptoms || symptoms.length === 0) {
        return res.redirect("/check-up");
      }

      const doctors = await Doctor.findAll({
        include: [
          {
            model: Disease,
            where: {
              id: {
                [Op.in]: symptoms,
              },
            },
          },
          {
            model: User,
          },
        ],
      });

      if (doctors.length === 0) {
        return res.send("No doctors found for the selected symptoms");
      }

      const user = await User.findByPk(userId);

      res.render("check-up-doctors", { doctors, symptoms, user });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async bookAppointment(req, res) {
    try {
      const { doctorId, symptoms } = req.body;
      const { userId } = req.session;

      const symptomsArray = symptoms.split(",").map(Number);

      const doctor = await Doctor.findByPk(doctorId, {
        include: {
          model: Disease,
          where: {
            id: {
              [Op.in]: symptomsArray,
            },
          },
        },
      });

      if (!doctor || doctor.Diseases.length === 0) {
        return res.redirect("/check-up");
      }

      const diseaseId = doctor.Diseases[0].id;

      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + 3);

      await Appointment.create({
        userId,
        doctorId: doctor.id,
        diseaseId,
        appointmentDate,
        status: "pending",
      });

      res.redirect("/appointments");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = CheckupController;
