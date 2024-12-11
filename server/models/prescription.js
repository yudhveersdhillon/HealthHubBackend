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
            ref: "Doctor", 
        },
        medicines: [
            {
                name: {
                    type: String,
                },
                dose: {
                    type: String,
                },
                medicineType: {
                    type: String,// cap,syrup,injection
                },
                dayFrequency: {
                    type: String,
                },
                duration: {
                    type: String,
                },
            },
        ],
        comments: {
            type: String,
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
        },
        nextVisitRemarks: {
            type: String,
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
