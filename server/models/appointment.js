var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG = require("../config/appConfig");

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient",  // Reference to the Patient model
            required: true,  // Patient ID is required
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",  // Reference to the Doctor model
            required: true,  // Doctor ID is required
        },
        appointmentDate: {
            type: Date,
            required: true,  // Appointment date and time are required
        },
        appointmentStatus: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],  // Define possible statuses
            default: "scheduled",  // Default status is 'scheduled'
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

module.exports = mongoose.model("Appointment", appointmentSchema);
