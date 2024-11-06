var mongoose = require("mongoose");
const CONFIG = require("../config/appConfig");
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
    },
    deviceId: {
      type: String,
    },
    birthdate: {
      type: Date,
    },
    dateofbirth: {
      type: Date,
    },
    password: {
      type: String,
      select: false,
    },
    age: {
      type: Number,
      default: 0,
    },
    refTextHeader: {
      type: String,
    },
    countryCode: {
      type: String,
      default: "+45",
    },
    refTextBody: {
      type: String,
    },
    country: {
      type: String,
    },
    nameidentifier: {
      type: String,
    },
    // managerId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Manager",
    // },
    token: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    sessionId: {
      type: String,
      default: null,
    },
    sessionUrl: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean
    },
    signupType: {
      type: String,
      default: "mitType",
    },
    status: {
      type: Number,
      default: CONFIG.ACTIVE_STATUS, // 0 = inactive, 1 = active, 2 = deleted
      index: true,
    },
    logoutStatus: {
      type: Number,
      default: CONFIG.ACTIVE_STATUS,
    },
    otp: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

userSchema.methods.setPassword = async function (password) {
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

userSchema.methods.comparePassword = async function (bodyPass) {
  let pass = await bcrypt.compare(bodyPass, this.password);
  return pass;
};

userSchema.methods.jwtToken = function () {
  return jwt.sign(
    {
      email: this.email,
      _id: this._id,
    },
    CONFIG.JWT_ENCRYPTION
  );
};

module.exports = mongoose.model("User", userSchema);
