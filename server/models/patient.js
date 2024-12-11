var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,  // Ensure the email is unique
    },
    phone: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],  // Gender options
    },
    address: {
      type: String,
    },
    medicalHistory: {
      type: String,
      // Optional field for patient's medical history
    },
    allergies: {
      type: [String], // Array of allergies if applicable

    },
    bloodGroup: {
      type: String, // Patient's blood group (optional)
    },
    emergencyContact: {
      name: {
        type: String,  // Name of emergency contact

      },
      phone: {
        type: String,  // Phone number of emergency contact

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
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

module.exports = mongoose.model("Patient", patientSchema);
