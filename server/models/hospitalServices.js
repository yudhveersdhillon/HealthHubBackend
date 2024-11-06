const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hospitalServiceSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: true, // Name of the service (e.g., "X-ray", "Blood Test")
        },
        serviceType: {
            type: String,
            enum: ["diagnostic", "therapy", "surgery", "supportive", "other"],
            required: true, // Category of the service (e.g., Diagnostic, Therapy)
        },
        description: {
            type: String,
            required: false, // Optional description of the service
        },
        cost: {
            type: Number,
            required: true, // Cost of the service
        },
        availability: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available", // Whether the service is currently available
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

// Index for efficient querying by service type
hospitalServiceSchema.index({ serviceType: 1, cost: 1 });

module.exports = mongoose.model("HospitalService", hospitalServiceSchema);
