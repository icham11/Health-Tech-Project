const router = require("express").Router();
const Controller = require("../controllers/Controller");
const checkupController = require("../controllers/checkupController");
const diseaseController = require("../controllers/diseaseController");

router.get("/", Controller.showHome);

router.get("/register", Controller.getRegisterForm);
router.post("/register", Controller.postRegister);

router.get("/login", Controller.getLoginForm);
router.post("/login", Controller.postLogin);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

router.use((req, res, next) => {
  if (!req.session.userId) {
    const error = "Please login first";
    return res.redirect(`/login?error=${error}`);
  }
  next();
});

router.get("/check-up", checkupController.checkupForm);
router.post("/check-up", checkupController.postCheckup);

const appointmentController = require("../controllers/appointmentController");
router.get("/appointments", appointmentController.listAppointments);

router.get("/diseases", diseaseController.listDiseases);

module.exports = router;
