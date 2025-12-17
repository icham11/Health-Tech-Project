const { User, UserProfile } = require("../models");

class ProfileController {
  static async editForm(req, res) {
    try {
      const { userId } = req.session;
      const user = await User.findByPk(userId, {
        include: UserProfile,
      });
      res.render("edit-profile", { user, error: null });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async updateProfile(req, res) {
    try {
      const { userId } = req.session;
      const {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        address,
        city,
        country,
      } = req.body;

      await UserProfile.update(
        { firstName, lastName, dateOfBirth, gender, address, city, country },
        { where: { userId } }
      );

      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = ProfileController;
