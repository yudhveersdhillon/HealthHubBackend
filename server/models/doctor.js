var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/appConfig");
const Schema = mongoose.Schema;

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,  // Email should be unique
      index: true,
    },
    phone: {
      type: String,
      required: true, // Phone number of the doctor
    },
    specialty: {
      type: String,
      required: true, // Doctor's specialty (e.g., Cardiology, Orthopedics)
    },
    licenseNumber: {
      type: String,
      required: true, // Medical license number of the doctor
    },
    yearsOfExperience: {
      type: Number,
      required: true, // Years of experience the doctor has
    },
    hospital: {
      type: String,
      required: true, // The hospital where the doctor works
    },
    department: {
      type: String,
      required: true, // The department in the hospital (e.g., Surgery, Pediatrics)
    },
    status: {
      type: Number,
      default: CONFIG.ACTIVE_STATUS, // 0 = inactive, 1 = active, 2 = deleted
      index: true,
    },
    address: {
      type: String,
      required: true, // Address of the doctor (where they are based)
    },
    password: {
      type: String,
      select: false, // Password is not returned in queries by default
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Method to set the password for the doctor
doctorSchema.methods.setPassword = async function (password) {
  return new Promise(async function (resolve, reject) {
    bcrypt.genSalt(parseInt(CONFIG.CRYPT_SECRET_KEY)).then((salt) => {
      bcrypt.hash(password, salt).then((hash) => {
        resolve(hash); // Resolve the hashed password
      });
    });
  });
};

// Method to compare the entered password with the stored password
doctorSchema.methods.comparePassword = async function (bodyPass) {
  let pass = await bcrypt.compare(bodyPass, this.password); // Compare passwords
  return pass; // Return true if they match, otherwise false
};

// Method to generate JWT token for the doctor
doctorSchema.methods.jwtToken = function () {
  return jwt.sign(
    {
      email: this.email,
      _id: this._id,
      name: this.name,
      specialty: this.specialty,
      hospital: this.hospital,
      department: this.department,
    },
    CONFIG.JWT_ENCRYPTION
  );
};

module.exports = mongoose.model("Doctor", doctorSchema);
