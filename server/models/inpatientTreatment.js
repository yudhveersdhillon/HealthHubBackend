var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG = require("../config/appConfig");

const inpatientTreatmentSchema = new mongoose.Schema(
    {
        inpatientId: {
            type: Schema.Types.ObjectId,
            ref: "Inpatient", // Reference to the Inpatient model
            required: true,
        },
        treatmentType: {
            type: String,
            required: true, // Type of treatment (e.g., Surgery, Medication, Therapy, etc.)
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor", // Doctor providing the treatment
            required: true,
        },
        treatmentDate: {
            type: Date,
            default: Date.now, // The date when the treatment is given
        },
        treatmentDetails: {
            type: String,
            required: true, // Description of the treatment
        },
        medications: [
            {
                medicineName: {
                    type: String,
                    required: true, // Medicine prescribed as part of the treatment
                },
                dosage: {
                    type: String,
                    required: true, // Dosage instructions (e.g., "2 tablets every 6 hours")
                },
                frequency: {
                    type: String,
                    required: true, // Frequency (e.g., "Once a day")
                },
            },
        ],
        hospitalServices: [
            {
                serviceType: {
                    type: String,
                    enum: ["X-ray", "Therapy", "Blood Test", "ECG", "Ultrasound", "Other"], // Various services that can be administered
                    required: true, // Type of service (e.g., X-ray, Therapy, etc.)
                },
                serviceDescription: {
                    type: String,
                    required: true, // Description of the service provided (e.g., "X-ray for chest examination")
                },
                serviceCost: {
                    type: Number,
                    required: true, // Cost of the service
                },
                serviceDate: {
                    type: Date,
                    default: Date.now, // Date when the service was administered
                },
            },
        ],
        notes: {
            type: String,
            required: false, // Additional notes or instructions for the treatment
        },
        treatmentStatus: {
            type: String,
            enum: ["ongoing", "completed", "pending"],
            default: "ongoing", // Current status of the treatment
        },
        followUpRequired: {
            type: Boolean,
            default: false, // Whether a follow-up is required after treatment
        },
        followUpDate: {
            type: Date,
            required: false, // Date for follow-up (if applicable)
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

// Indexing on inpatientId and doctorId for efficient querying
inpatientTreatmentSchema.index({ inpatientId: 1, doctorId: 1 });

module.exports = mongoose.model("InpatientTreatment", inpatientTreatmentSchema);
