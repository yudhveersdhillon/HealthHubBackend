var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG = require("../config/appConfig");

const inpatientSchema = new mongoose.Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient", // Reference to the Patient model
            required: true,
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor", // Reference to the Doctor model
        },
        admissionDate: {
            type: Date,
            default: Date.now, // Admission date (defaults to current time)
        },
        roomNumber: {
            type: String,
        },
        bedNumber: {
            type: String,
        },
        patientadmissionstatus: {
            type: String,
            enum: ["admitted", "discharged", "pending"], // Status of the patient
            default: "admitted", // Default status is "admitted"
        },
        admissionReason: {
            type: String,
            // Reason for hospitalization (e.g., surgery, treatment, observation)
        },
        medicalHistory: {
            type: String,
            // Optional medical history or remarks related to admission
        },
        notes: {
            type: String,
            // Additional notes or instructions for the care team
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the hospital admin or staff who created the admission record

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

// Create an index for faster queries based on patientId and status
inpatientSchema.index({ patientId: 1, status: 1 });

module.exports = mongoose.model("Inpatient", inpatientSchema);
