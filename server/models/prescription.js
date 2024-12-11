var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG = require("../config/appConfig");

const prescriptionSchema = new mongoose.Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient", // Reference to the Patient model
            required: true,
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
        },
        medicines: [
            {
                name: {
                    type: String, // Name of the Medicne
                },
                dose: {
                    type: String, // Dosage instructions (e.g., "10mg")
                },
                medicineType: {
                    type: String, // Cap,syrup,injection
                },
                dayFrequency: {
                    type: String, // Dosage instructions (e.g."2 times a day")
                },
                duration: {
                    type: String, // Duration of medicine usage (e.g., "7 days", "1 month")
                },
            },
        ],
        comments: {
            type: String, // Optional comments section for doctor’s additional notes
        },
        datePrescribed: {
            type: Date,
            default: Date.now, // Automatically records the date when the prescription is made
        },
      
        nextVisitDate: {
            type: Date,
        },
        nextVisitRemarks: {
            type: String,
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

module.exports = mongoose.model("Prescription", prescriptionSchema);
