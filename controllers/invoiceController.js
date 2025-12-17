const easyinvoice = require("easyinvoice");
const fs = require("fs");
const path = require("path");
const {
  Appointment,
  User,
  Doctor,
  Disease,
  UserProfile,
} = require("../models");

class InvoiceController {
  static async downloadInvoice(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.session;

      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: User,
            include: UserProfile,
          },
          {
            model: Doctor,
            include: User,
          },
          Disease,
        ],
      });

      if (!appointment) {
        return res.status(404).send("Appointment not found");
      }

      if (appointment.userId !== userId) {
        return res.status(403).send("Unauthorized");
      }

      const isPaid = appointment.status === "completed";
      const paymentStatus = isPaid ? "PAID" : "UNPAID";

      const diseaseLevel = appointment.Disease.level;
      const price = diseaseLevel * 500000;

      const data = {
        images: {
          // "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
        },
        sender: {
          company: "Health Tech Clinic",
          address: "Jl. Bugarkarta No. 123",
          zip: "12345",
          city: "Bugarkarta",
          country: "Indonesinga",
        },
        client: {
          company: appointment.User.UserProfile
            ? `${appointment.User.UserProfile.firstName} ${appointment.User.UserProfile.lastName}`
            : appointment.User.username,
          address:
            appointment.User.UserProfile && appointment.User.UserProfile.address
              ? appointment.User.UserProfile.address
              : "Address Not Set",
          zip: "00000",
          city:
            appointment.User.UserProfile && appointment.User.UserProfile.city
              ? appointment.User.UserProfile.city
              : "City Not Set",
          country:
            appointment.User.UserProfile && appointment.User.UserProfile.country
              ? appointment.User.UserProfile.country
              : "Country Not Set",
        },
        information: {
          number: `INV-${appointment.id}`,
          date: appointment.appointmentDate.toISOString().split("T")[0],
          "due-date": appointment.appointmentDate.toISOString().split("T")[0],
        },
        products: [
          {
            quantity: 1,
            description: `Consultation with Dr. ${appointment.Doctor.User.username} (${appointment.Disease.name})`,
            "tax-rate": 0,
            price: price,
          },
        ],
        "bottom-notice": `Status: ${paymentStatus}. Please pay your invoice within 14 days.`,
        settings: {
          currency: "IDR",
        },
        translate: {},
      };

      const result = await easyinvoice.createInvoice(data);
      const pdfBase64 = result.pdf;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${appointment.id}.pdf`
      );
      res.send(Buffer.from(pdfBase64, "base64"));
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
}

module.exports = InvoiceController;
