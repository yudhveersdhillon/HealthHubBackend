const mongoose = require("mongoose");
const CONFIG = require("../config/appConfig");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { subscribe } = require("../v1/routes");

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
        profileImage: {
            type: String,
        },
        totalBeds: {
            type: Number,
        },
        departments: [{
            type: String, // You can list departments like Cardiology, Orthopedics, etc.
        }],

        profileImage: {
            type: String
        },
        password: {
            type: String,
        },
        ipd: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        pharmacy: {
            type: Boolean,
            default: false
        },
        lab: {
            type: Boolean,
            default: false
        },
        subscription: {
            type: Boolean,
            default: false
        },
        subscriptionDateExpiry: {
            type: Date,
        },
        otp: {
            type: Number,
            default: 0,
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
