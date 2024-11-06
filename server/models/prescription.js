var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new mongoose.Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient", // Reference to the Patient model
            required: true,
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor", // Reference to the Doctor model
            required: true,
        },
        medicines: [
            {
                name: {
                    type: String,
                    required: true, // Name of the medicine
                },
                dose: {
                    type: String,
                    required: true, // Dosage instructions (e.g., "10mg")
                },
                dayFrequency: {
                    type: String,
                    required: true, // Dosage instructions (e.g."2 times a day")
                },
                duration: {
                    type: String,
                    required: true, // Duration of medicine usage (e.g., "7 days", "1 month")
                },
            },
        ],
        comments: {
            type: String,
            required: false, // Optional comments section for doctor’s additional notes
        },
        datePrescribed: {
            type: Date,
            default: Date.now, // Automatically records the date when the prescription is made
        },
        status: {
            type: String,
            enum: ["active", "completed", "cancelled"], // Status of the prescription
            default: "active", // Default status
        },
        nextVisitDate: {
            type: Date,
            required: false, // Optional field to store the next scheduled visit date
        },
        nextVisitRemarks: {
            type: String,
            required: false, // Optional field to store remarks about the next visit
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

// Creating the model for the Prescription
module.exports = mongoose.model("Prescription", prescriptionSchema);
