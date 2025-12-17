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
      const { symptoms } = req.body;
      const userId = req.session.userId;

      if (!symptoms || symptoms.length === 0) {
        return res.redirect("/check-up");
      }

      const doctors = await Doctor.findAll({
        include: {
          model: Disease,
          where: {
            id: {
              [Op.in]: symptoms,
            },
          },
        },
      });

      if (doctors.length === 0) {
        return res.send("No doctors found for the selected symptoms");
      }

      let bestMatch = {
        doctor: null,
        matchCount: 0,
      };

      for (const doctor of doctors) {
        const matchCount = doctor.Diseases.length;
        if (matchCount > bestMatch.matchCount) {
          bestMatch = {
            doctor,
            matchCount,
          };
        }
      }

      const diseaseId = await Disease.findOne({
        where: { id: symptoms[0] },
      });

      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + 3);

      await Appointment.create({
        userId,
        doctorId: bestMatch.doctor.id,
        diseaseId: diseaseId.id,
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
