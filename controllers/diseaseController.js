const { Disease, User } = require("../models");
const { Op } = require("sequelize");

class DiseaseController {
  static async listDiseases(req, res) {
    try {
      const { search, error } = req.query;
      const options = {
        where: {},
        order: [["name", "ASC"]],
      };

      if (search) {
        options.where.name = {
          [Op.iLike]: `%${search}%`,
        };
      }

      const diseases = await Disease.findAll(options);
      const { userId, role } = req.session;

      let user = null;
      if (userId) {
        user = await User.findByPk(userId);
      }

      res.render("diseases", { diseases, user, role, error });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async addForm(req, res) {
    try {
      const { userId } = req.session;
      const user = await User.findByPk(userId);
      res.render("disease-form", { disease: null, error: null, user });
    } catch (error) {
      res.send(error);
    }
  }

  static async createDisease(req, res) {
    const { name, description, level } = req.body;
    try {
      await Disease.create({ name, description, level });
      res.redirect("/diseases?success=Disease added successfully");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message);
        const { userId } = req.session;
        const user = await User.findByPk(userId);
        res.render("disease-form", {
          disease: { name, description, level },
          error: errors,
          user,
        });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  }

  static async editForm(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.session;
      const user = await User.findByPk(userId);
      const disease = await Disease.findByPk(id);
      res.render("disease-form", { disease, error: null, user });
    } catch (error) {
      res.send(error);
    }
  }

  static async updateDisease(req, res) {
    const { id } = req.params;
    const { name, description, level } = req.body;
    try {
      await Disease.update({ name, description, level }, { where: { id } });
      res.redirect("/diseases?success=Disease updated successfully");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message);
        const { userId } = req.session;
        const user = await User.findByPk(userId);
        res.render("disease-form", {
          disease: { id, name, description, level },
          error: errors,
          user,
        });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  }

  static async deleteDisease(req, res) {
    try {
      const { id } = req.params;
      await Disease.destroy({ where: { id } });
      res.redirect("/diseases?success=Disease deleted successfully");
    } catch (error) {
      res.redirect(`/diseases?error=${error.message}`);
    }
  }
}

module.exports = DiseaseController;
