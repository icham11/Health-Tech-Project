const { Disease, User } = require("../models");
const { Op } = require("sequelize");

class DiseaseController {
  static async listDiseases(req, res) {
    try {
      const { search } = req.query;
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
      const { userId } = req.session;

      let user = null;
      if (userId) {
        user = await User.findByPk(userId);
      }

      res.render("diseases", { diseases, user });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = DiseaseController;
