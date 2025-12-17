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
router.post("/check-up/book", checkupController.bookAppointment);

const appointmentController = require("../controllers/appointmentController");
const invoiceController = require("../controllers/invoiceController"); // Import
router.get("/appointments", appointmentController.listAppointments);
router.get("/appointments/:id/cancel", appointmentController.cancelAppointment);
router.get(
  "/appointments/:id/complete",
  appointmentController.completeAppointment
);
router.get("/appointments/:id/invoice", invoiceController.downloadInvoice); // Route

const profileController = require("../controllers/profileController");
router.get("/profile/edit", profileController.editForm);
router.post("/profile/edit", profileController.updateProfile);

router.get("/diseases", diseaseController.listDiseases);

// Middleware to check if user is doctor (simple check)
const isDoctor = (req, res, next) => {
  if (req.session.role === "doctor") {
    next();
  } else {
    res.send("Unauthorized: Only Doctors can manage diseases.");
  }
};

router.get("/diseases/add", isDoctor, diseaseController.addForm);
router.post("/diseases/add", isDoctor, diseaseController.createDisease);
router.get("/diseases/:id/edit", isDoctor, diseaseController.editForm);
router.post("/diseases/:id/edit", isDoctor, diseaseController.updateDisease);
router.get("/diseases/:id/delete", isDoctor, diseaseController.deleteDisease);

module.exports = router;
