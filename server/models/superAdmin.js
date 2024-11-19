const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const superAdminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

// Method to compare hashed passwords
superAdminSchema.methods.comparePassword = async function (bodyPass) {
    return await bcrypt.compare(bodyPass, this.password);
};

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
