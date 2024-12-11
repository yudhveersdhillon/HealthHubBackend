const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG = require("../config/appConfig");

const dischargeSchema = new mongoose.Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient", // Reference to the Patient model
            required: true,
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor", // Reference to the Doctor responsible for discharge
            required: true,
        },
        dischargeDate: {
            type: Date,
            default: Date.now, // Date of discharge
        },
        dischargeType: {
            type: String,
            enum: ["regular", "referred"], // Type of discharge: 'regular' for normal discharge, 'referred' if transferred
            required: true,
        },
        finalDiagnosis: {
            type: String,
            required: true, // Final diagnosis at the time of discharge
        },
        treatmentSummary: {
            type: String,
            required: true, // Summary of treatments provided during stay
        },
        medicationsOnDischarge: [
            {
                medicineName: {
                    type: String,
                    required: true,
                },
                dosage: {
                    type: String,
                    required: true, // Dosage for each medicine
                },
                frequency: {
                    type: String,
                    required: true, // Frequency (e.g., "Twice a day")
                },
                duration: {
                    type: String,
                    required: true, // Duration (e.g., "5 days")
                },
            },
        ],
        followUpInstructions: {
            type: String,
            required: false, // Any instructions for follow-up care
        },
        dischargeStatus: {
            type: String,
            enum: ["completed", "pending"],
            default: "completed", // Status of the discharge process
        },
        referralHospital: {
            type: String,
            required: function () { return this.dischargeType === "referred"; }, // Name of hospital if referred
        },
        referralNotes: {
            type: String,
            required: false, // Additional notes if referred to another hospital
        },
        totalCost: {
            type: Number,
            required: true, // Total cost for the patient's treatment and stay
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

module.exports = mongoose.model("Discharge", dischargeSchema);
