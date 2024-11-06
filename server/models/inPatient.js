var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inpatientSchema = new mongoose.Schema(
    {
        patientId: {
            type: Schema.Types.ObjectId,
            ref: "Patient", // Reference to the Patient model
            required: true,
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor", // Reference to the Doctor model
            required: true, // Admitting doctor
        },
        admissionDate: {
            type: Date,
            default: Date.now, // Admission date (defaults to current time)
        },
        dischargeDate: {
            type: Date,
            required: false, // This will be filled when the patient is discharged
        },
        roomNumber: {
            type: String,
            required: true, // Room assigned for the patient
        },
        bedNumber: {
            type: String,
            required: true, // Bed assigned within the room
        },
        status: {
            type: String,
            enum: ["admitted", "discharged", "pending"], // Status of the patient
            default: "admitted", // Default status is "admitted"
        },
        admissionReason: {
            type: String,
            required: true, // Reason for hospitalization (e.g., surgery, treatment, observation)
        },
        medicalHistory: {
            type: String,
            required: false, // Optional medical history or remarks related to admission
        },
        notes: {
            type: String,
            required: false, // Additional notes or instructions for the care team
        },
        followUpDate: {
            type: Date,
            required: false, // Optional follow-up date after discharge
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // Reference to the hospital admin or staff who created the admission record
            required: true,
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
      }
);

// Create an index for faster queries based on patientId and status
inpatientSchema.index({ patientId: 1, status: 1 });

module.exports = mongoose.model("Inpatient", inpatientSchema);
