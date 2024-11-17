const mongoose = require("mongoose");
const CONFIG = require("../config/appConfig");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        address: {
            type: String,
           
        },
        contactNumber: {
            type: String,
        },
        email: {
            type: String,
            
        },
        website: {
            type: String,
        },
        totalBeds: {
            type: Number,
        },
        departments: [{
            type: String, // You can list departments like Cardiology, Orthopedics, etc.
        }],
        status: {
            type: Number,
            default: 1, // 1 = active, 0 = inactive
        },
        profileImage: {
            type: String
        },
        password: {
            type: String,
        },
        doctors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Doctor", // Assuming a Doctor model exists
            },
        ],
        staff: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Staff", // Assuming a Staff model exists
            },
        ],
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

adminSchema.methods.setPassword = async function (password) {
    return new Promise(async function (resolve, reject) {
        // generate a salt
        bcrypt.genSalt(parseInt(CONFIG.CRYPT_SECRET_KEY)).then((salt) => {
            // hash the password using our new salt
            bcrypt.hash(password, salt).then((hash) => {
                resolve(hash);
            });
        });
    });
};

adminSchema.methods.comparePassword = async function (bodyPass) {
    let pass = await bcrypt.compare(bodyPass, this.password);
    return pass;
};

module.exports = mongoose.model("Admin", adminSchema);
