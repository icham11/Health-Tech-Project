const { Appointment, Doctor, Disease, User } = require("../models");

class AppointmentController {
  static async listAppointments(req, res) {
    try {
      const { userId } = req.session;
      const appointments = await Appointment.findAll({
        where: { userId },
        include: [
          {
            model: Doctor,
            include: User,
          },
          Disease,
        ],
        order: [["appointmentDate", "DESC"]],
      });
      res.render("appointments", { appointments });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = AppointmentController;
