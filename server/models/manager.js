var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CONFIG = require("../config/appConfig");
const Schema = mongoose.Schema;

managerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    companyName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      index: true,
    },
    ageLimit: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: null,
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    password: {
      type: String,
      select: false,
    },
    status: {
      type: Number,
      default: CONFIG.ACTIVE_STATUS, // 0 = inactive, 1 = active, 2 = deleted
      index: true,
    },
    role: {
      type: String,
      default: "Manager",
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
managerSchema.index({ location: "2dsphere" });

managerSchema.methods.setPassword = async function (password) {
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

managerSchema.methods.comparePassword = async function (bodyPass) {
  let pass = await bcrypt.compare(bodyPass, this.password);
  return pass;
};

managerSchema.methods.jwtToken = function () {
  return jwt.sign(
    {
      email: this.email,
      _id: this._id,
      companyName: this.companyName,
    },
    CONFIG.JWT_ENCRYPTION
  );
};

module.exports = mongoose.model("Manager", managerSchema);
