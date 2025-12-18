const {
  Disease,
  Symptom,
  User,
  UserProfile,
  Appointment,
  Doctor,
} = require("../models");
const bcrypt = require("bcryptjs");

class Controller {
  static async showHome(req, res) {
    try {
      const { userId } = req.session;

      let user = null;
      let appointments = [];

      if (userId) {
        user = await User.findByPk(userId, {
          include: {
            model: UserProfile,
          },
        });

        if (user.role === "doctor") {
          const doctor = await Doctor.findOne({ where: { userId } });
          if (doctor) {
            appointments = await Appointment.findAll({
              where: { doctorId: doctor.id },
              include: [
                {
                  model: User,
                  include: UserProfile,
                },
                Disease,
              ],
            });
          }
        } else {
          appointments = await Appointment.findAll({
            where: { userId },
            include: [
              {
                model: Doctor,
                include: User,
              },
              Disease,
            ],
          });
        }
      }

      res.render("home", { user, appointments });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  static async getDiseases(req, res) {
    try {
      const diseases = await Disease.findAll();
      res.render("diseases", { diseases });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getDiseaseById(req, res) {
    try {
      const { id } = req.params;
      const disease = await Disease.findByPk(id, {
        include: Symptom,
      });
      res.render("diseaseDetail", { disease });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getRegisterForm(req, res) {
    try {
      res.render("register", { user: null });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  static async postRegister(req, res) {
    try {
      const {
        username,
        email,
        password,
        role,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        address,
        city,
        country,
        specialization
      } = req.body;
      const user = await User.create({ username, email, password, role });
      await UserProfile.create({
        firstName,
        lastName,
        dateOfBirth,
        gender,
        address,
        city,
        country,
        userId: user.id,
      });

      if (role === "doctor") {
        await Doctor.create({
          userId: user.id,
          specialization: specialization || "General",
        });
      }

      res.redirect("/login");
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message);
        res.status(400).send(errors);
      } else if (error.name === "SequelizeUniqueConstraintError") {
        const errors = error.errors.map((el) => el.message);
        res.status(400).send(errors);
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  }

  static async getLoginForm(req, res) {
    try {
      res.render("login", { user: null });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  static async postLogin(req, res) {
    try {
      const { email, password } = req.body;
      const errors = [];

      // VALIDATION KOSONG
      if (!email || !email.trim()) {
        errors.push("Email is required");
      }

      if (!password || !password.trim()) {
        errors.push("Password is required");
      }

      if (errors.length > 0) {
        return res.render("login", { errors });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.render("login", { errors: ["Email not found"] });
      }

      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        return res.render("login", { errors: ["Incorrect password"] });
      }

      req.session.userId = user.id;
      req.session.role = user.role;
      res.redirect("/");
    } catch (error) {
      res.send(error);
    }
  }

  static getLogout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        res.redirect("/");
      }
    });
  }
}

module.exports = Controller;
