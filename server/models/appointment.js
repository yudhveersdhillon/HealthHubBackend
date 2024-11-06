var mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],  // Define possible statuses
            default: "scheduled",  // Default status is 'scheduled'
        },
    },
    {
        timestamps: true,  // Automatically add createdAt and updatedAt
    }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
