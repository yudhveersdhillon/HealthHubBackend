const mongoose = require("mongoose");
const CONFIG = require("../config/appConfig");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensures uniqueness of email addresses
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        status: {
            type: Number,
            default: CONFIG.ACTIVE_STATUS, // 0 = inactive, 1 = active, 2 = deleted
            index: true,
        },
        profileImage: {
            type: String,
            default: null
        },
        otp: {
            type: Number,
            default: 0
        },
        storeId: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Store",
                default: null,
            },
        ],
        status: {
            type: Number,
            default: CONFIG.ACTIVE_STATUS, // 0 = inactive, 1 = active, 2 = deleted
        },
        role: {
            type: String,
            enum: ["admin", "manager"],
            default: "admin",
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
