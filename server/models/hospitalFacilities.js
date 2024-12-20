const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG = require("../config/appConfig");

const hospitalFacilitySchema = new mongoose.Schema(
  {
    facilityType: {
      type: String,
      required: true,
      enum: ["room", "ICU", "ward", "operation theatre", "laboratory", "radiology", "therapy", "other"], // Different types of facilities
    },
    description: {
      type: String,
      required: true, // Description of the facility (e.g., "Private Room with AC")
    },
    costPerDay: {
      type: Number,
      required: false, // Cost per day for facilities like rooms, ICU, etc.
    },
    costPerUse: {
      type: Number,
      required: false, // Cost per use for one-time services (e.g., MRI scan, operation theatre)
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "unavailable", "in use"],
      default: "available", // Status of the facility
    },
    additionalNotes: {
      type: String,
      required: false, // Any additional notes about the facility
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

module.exports = mongoose.model("HospitalFacility", hospitalFacilitySchema);
