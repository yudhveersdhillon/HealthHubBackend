var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG = require("../config/appConfig");

const prescriptionSchema = new mongoose.Schema(
    {
        prescriptionTemplate: {
            type: String,
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

module.exports = mongoose.model("Prescription", prescriptionSchema);
