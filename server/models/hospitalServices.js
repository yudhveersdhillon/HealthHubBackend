const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG = require("../config/appConfig");

const hospitalServiceSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
        },
        serviceType: {
            type: String,
            enum: ["diagnostic", "therapy", "surgery", "supportive", "other"],
        },
        description: {
            type: String,
            required: false, // Optional description of the service
        },
        cost: {
            type: Number,
        },
        availability: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available", // Whether the service is currently available
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

// Index for efficient querying by service type
hospitalServiceSchema.index({ serviceType: 1, cost: 1 });

module.exports = mongoose.model("HospitalService", hospitalServiceSchema);
