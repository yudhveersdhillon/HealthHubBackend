var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/appConfig");
const Schema = mongoose.Schema;

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,

    },
    phone: {
      type: String,
    },
    specialty: {
      type: String,
      // Doctor's specialty (e.g., Cardiology, Orthopedics)
    },
    licenseNumber: {
      type: String,
      // Medical license number of the doctor
    },
    yearsOfExperience: {
      type: Number,
      // Years of experience the doctor has
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Assuming a Doctor model exists
    },
    profileImage: {
      type: String
    },
    department: {
      type: String,
      // The department in the hospital (e.g., Surgery, Pediatrics)
    },
    status: {
      type: Number,
      default: CONFIG.ACTIVE_STATUS, // 0 = inactive, 1 = active, 2 = deleted
      index: true,
    },
    address: {
      type: String,
      // Address of the doctor (where they are based)
    },
    otp: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      // Password is not returned in queries by default
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
