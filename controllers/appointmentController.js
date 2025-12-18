const { Appointment, Doctor, Disease, User } = require("../models");

class AppointmentController {
  static async listAppointments(req, res) {
    try {
      const { userId } = req.session;
      const user = await User.findByPk(userId);
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
      res.render("appointments", { appointments, user });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.session;
      const appointment = await Appointment.findByPk(id);

      if (!appointment) {
        return res.redirect("/appointments");
      }

      if (appointment.userId !== userId) {
        return res.send("Unauthorized");
      }

      if (appointment.status === "pending") {
        await appointment.update({ status: "cancelled" });
      }

      res.redirect("/appointments?success=Appointment cancelled successfully.");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async completeAppointment(req, res) {
    try {
      const { id } = req.params;
      const { userId, role } = req.session;

      if (role !== "doctor") {
        return res.send("Unauthorized");
      }

      const appointment = await Appointment.findByPk(id, {
        include: {
          model: Doctor,
          where: { userId },
        },
      });

      if (!appointment) {
        return res.send("Unauthorized or Appointment Not Found");
      }

      if (appointment.status === "pending") {
        await appointment.update({ status: "completed" });
      }

      res.redirect("/?success=Appointment marked as completed.");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = AppointmentController;
