var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // Patient's first name
    },
    lastName: {
      type: String,
      required: true, // Patient's last name
    },
    email: {
      type: String,
      required: true,
      unique: true,  // Ensure the email is unique
    },
    phone: {
      type: String,
      required: true, // Patient's contact number
    },
    dateOfBirth: {
      type: Date,
      required: true, // Patient's date of birth
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],  // Gender options
      required: true,
    },
    address: {
      type: String,
      required: true, // Patient's address
    },
    medicalHistory: {
      type: String,
      required: false,  // Optional field for patient's medical history
    },
    allergies: {
      type: [String], // Array of allergies if applicable
      required: false,
    },
    bloodGroup: {
      type: String, // Patient's blood group (optional)
    },
    emergencyContact: {
      name: {
        type: String,  // Name of emergency contact
        required: false,
      },
      phone: {
        type: String,  // Phone number of emergency contact
        required: false,
      },
    },
    insuranceProvider: {
      type: String,  // Name of the insurance provider
    },
    insurancePolicyNumber: {
      type: String,  // Insurance policy number (if applicable)
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],  // Patient's account status
      default: "active",  // Default status is active
    },
    createdAt: {
      type: Date,
      default: Date.now,  // Automatically sets the date when the patient is created
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Patient", patientSchema);
