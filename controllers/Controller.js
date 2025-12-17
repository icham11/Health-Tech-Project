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
      } = req.body;
      const user = await User.create({ username, email, password, role });
      await UserProfile.create({
        firstName,
        lastName,
        dateOfBirth,
        gender,
        userId: user.id,
      });
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
      const user = await User.findOne({ where: { email } });
      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (isValidPassword) {
          req.session.userId = user.id;
          req.session.role = user.role;
          return res.redirect("/");
        }
      }
      const error = "Invalid email or password";
      res.status(401).render("login", { error, user: null });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
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
