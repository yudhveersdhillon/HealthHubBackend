var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CONFIG = require("../config/appConfig");

// Instructions Schema for storing predefined instructions
const instructionsSchema = new mongoose.Schema(
    {
        instructionName: {
            type: String,
            required: true, // Instruction name is mandatory
            unique: true,  // Ensures the instruction name is unique
            trim: true, // Removes extra spaces
        },
        instructionText: {
            type: String,
            trim: true, // Removes extra spaces
        },
        category: {
            type: String,
            enum: ['general', 'medication', 'diet', 'exercise', 'post-op', 'other'],
            default: 'general', // Default to 'general' category
        },
        status: {
            type: Number,
            default: CONFIG.ACTIVE_STATUS, // 0 = inactive, 1 = active, 2 = deleted
            index: true,
          },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

module.exports = mongoose.model("Instructions", instructionsSchema);
