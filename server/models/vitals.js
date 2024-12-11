var mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Vitals Schema for capturing daily measurements
const vitalsSchema = new mongoose.Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient", // Reference to the Patient model
            required: true,
        },
        date: {
            type: Date,
            default: Date.now, // Default to the current date
        },
        bloodPressure: {
            type: String, // blood Pressure 120/80
        },
        heartRate: {
            type: Number, // Heart rate in beats per minute (bpm)
        },
        temperature: {
            type: Number, // Temperature in Celsius (e.g., 37.5)
        },
        weight: {
            type: Number, // Weight in kilograms (e.g., 70)
        },
        height: {
            type: Number, // Height in centimeters (e.g., 170)
        },
        oxygenSaturation: {
            type: Number, // Oxygen saturation percentage (e.g., 98)
        },
        respiratoryRate: {
            type: Number, // Respiratory rate per minute (e.g., 16)
        },
        comments: {
            type: String, // Optional comments for additional notes by the healthcare provider
        },
        status: {
            type: String,
            enum: ["normal", "elevated", "critical"], // Status of vitals assessment
            default: "normal", // Default status
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

// Create a model for the Vitals schema
module.exports = mongoose.model("Vitals", vitalsSchema);
