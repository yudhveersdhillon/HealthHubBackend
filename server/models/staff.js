var mongoose = require("mongoose");
const CONFIG = require("../config/appConfig");
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name of the staff member
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true, // Ensure email is unique for each staff member
      index: true,
    },
    birthdate: {
      type: Date,
      required: true, // Birthdate is required for staff registration
    },
    password: {
      type: String,
      select: false,  // Password is not selected by default
    },
    age: {
      type: Number,
      default: 0,  // Will be automatically calculated based on birthdate if necessary
    },
    countryCode: {
      type: String,
      default: "+45",
    },
    phone: {
      type: String,
      required: true,  // Staff member's phone number is now required
    },
    status: {
      type: Number,
      default: CONFIG.ACTIVE_STATUS,  // Default to active status (1)
      index: true,
    },
    otp: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["receptionist", "nurse" ], // Defining roles for the hospital staff
      required: true,  // Role must be specified when registering the staff member
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",  // Reference to the hospital where the staff member is working
      required: true,  // Hospital must be specified
    },
    department: {
      type: String,
      required: function() {
        return this.role !== 'receptionist';  // Department is required for all roles except receptionist
      },
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",  // Reference to the admin who registered the staff member
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Method to set the password for the staff
staffSchema.methods.setPassword = async function (password) {
  return new Promise(async function (resolve, reject) {
    bcrypt.genSalt(parseInt(CONFIG.CRYPT_SECRET_KEY)).then((salt) => {
      bcrypt.hash(password, salt).then((hash) => {
        resolve(hash); // Resolve the hashed password
      });
    });
  });
};

// Method to compare the entered password with the stored password
staffSchema.methods.comparePassword = async function (bodyPass) {
  let pass = await bcrypt.compare(bodyPass, this.password); // Compare passwords
  return pass; // Return true if they match, otherwise false
};

// Method to generate JWT token for the staff
staffSchema.methods.jwtToken = function () {
  return jwt.sign(
    {
      email: this.email,
      _id: this._id,
      role: this.role, // Adding the role to the JWT token
      hospital: this.hospital, // Hospital information
    },
    CONFIG.JWT_ENCRYPTION
  );
};

module.exports = mongoose.model("Staff", staffSchema);
