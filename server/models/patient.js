var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG = require("../config/appConfig");

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
    },
    uniquePatientId: {
      type: String,
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
    
    createdAt: {
      type: Date,
      default: Date.now,  // Automatically sets the date when the patient is created
    },
    status: {
      type: Number,
      default: CONFIG.ACTIVE_STATUS, // 0 = inactive, 1 = active, 2 = deleted
      index: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

module.exports = mongoose.model("Patient", patientSchema);
