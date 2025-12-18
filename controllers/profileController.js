const { User, UserProfile } = require("../models");

class ProfileController {
  static async editForm(req, res) {
    try {
      const { userId } = req.session;

      const user = await User.findByPk(userId, {
        include: UserProfile,
      });

      const profile = user ? user.UserProfile : null;

      res.render("edit-profile", {
        user,
        profile,
        errors: null,
      });
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

      res.redirect("/?success=Profile updated successfully");
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message);
        const { userId } = req.session;
        const user = await User.findByPk(userId);

        const profile = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateOfBirth: req.body.dateOfBirth
            ? new Date(req.body.dateOfBirth)
            : null,
          gender: req.body.gender,
          address: req.body.address,
          city: req.body.city,
          country: req.body.country,
        };

        res.render("edit-profile", {
          user,
          profile,
          errors,
        });
      } else {
        res.status(500).send({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = ProfileController;
