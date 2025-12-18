# 🏥 Health Tech Platform

> **Modern Healthcare Management System**  
> _Connecting patients with the right specialists through intelligent symptom matching._

![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![Express](https://img.shields.io/badge/Express-4.x-blue) ![Sequelize](https://img.shields.io/badge/Sequelize-ORM-blueviolet) ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791) ![Bootstrap](https://img.shields.io/badge/Style-Bootstrap%204-purple)

---

## 📖 About The Project

**Health Tech** is a comprehensive web application designed to streamline the interaction between patients and healthcare providers. It features a robust appointment system that intelligently matches patients to doctors based on their reported symptoms, ensuring efficient and accurate medical care.

Built with a focus on **User Experience (UX)** and **Data Integrity**, the platform offers seamless navigation, real-time feedback notifications, and strict validation to ensure every record is accurate.

---

## ✨ Key Features

### For Patients 👤

- **🩺 Smart Symptom Check-up**: Select your symptoms, and our system automatically finds the right specialists (e.g., Cardiologist, Neurologist) for you.
- **📅 Easy Appointment Booking**: Book appointments with available doctors in just a few clicks.
- **📂 Digital Medical History**: View your complete appointment history and status (Pending, Completed, Cancelled).
- **📄 Instant Invoices**: Download professional PDF invoices immediately after your appointment is completed.
- **🔔 Interactive Feedback**: Receive instant confirmation notifications for every action (booking, cancelling, updating profile).

### For Doctors 👨‍⚕️

- **🦠 Disease Management**: Full control to Add, Edit, and Delete disease entries in the database.
- **📋 Patient Queue**: View upcoming appointments and patient details.
- **✅ Appointment Completion**: Mark appointments as complete with a single click to trigger invoice generation.
- **🛡️ Secure Access**: Exclusive dashboard features protected by role-based authorization.

### Technical Highlights 🛠

- **Robust Validation**: Server-side validation for all forms (Registration, Disease Entry, Profile Editing) ensuring data quality.
- **Feedback Loop**: Implemented "Promise Chaining" notifications to provide specific success/error messages across page redirects.
- **Secure Authentication**: Password hashing with `bcryptjs` and session-based authentication.
- **Responsive Details**: Field-level error messages and value retention in forms to prevent user frustration.

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- PostgreSQL Database

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/health-tech-project.git
    cd health-tech-project
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Database Setup**
    Configure your database credentials in `config/config.json`.

    ```bash
    npx sequelize-cli db:create
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    ```

4.  **Run the App**

    ```bash
    npm run dev
    # or
    node app.js
    ```

5.  **Visit**
    Open `http://localhost:3000` in your browser.

---

## 💡 How to Use

### 1. Registration

- Sign up as a **Patient** or **Doctor**.
- **Doctors** must select their specialization (e.g., Surgeon, General, Pediatrician).
- All profile fields (Address, DOB, Gender) are validated.

### 2. The Flow

1.  **Doctor** logs in -> Adds new Diseases/Symptoms to the database.
2.  **Patient** logs in -> Goes to "Check Up".
3.  Patient selects symptoms -> System shows matching Doctors.
4.  Patient books an appointment.
5.  **Doctor** sees the appointment -> Marks it as "Complete".
6.  **Patient** download the Invoice PDF.

---

## 👨‍💻 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Sequelize ORM
- **Frontend**: EJS Templating, Bootstrap 4, Custom CSS
- **Utilities**: `bcryptjs` (Auth), `easyinvoice` (PDFs)

---

## 📝 License

This project is open-source and available for educational purposes.

---

<p align="center">
  Made with ❤️ by <strong>Wahid Nurhisyam & Halim Ornest</strong>
</p>
