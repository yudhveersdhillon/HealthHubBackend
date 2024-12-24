var passwordValidator = require("password-validator");
var mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isValidPassword(pass) {
  var schema = new passwordValidator();
  schema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().digits() // Must have digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(["Password", "Password123"]);

  //disabled this to fit flutter app validation
  //.has().uppercase() // Must have uppercase letters
  //.has().lowercase() // Must have lowercase letters

  if (!schema.validate(pass)) return false;
  else return true;
}

function toObjectId(id) {
  return mongoose.Types.ObjectId(id);
}

function idValidObjectId(id) {
  const ObjectId = mongoose.Types.ObjectId;
  return ObjectId.isValid(id) ? true : false;
}
const storageadminImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("server", "public", "uploads", "profileImage")); // Destination folder where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Unique filename generation
    const ext = path.extname(file.originalname); // Extract file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Set filename
  },
});

const uploadAdminImage = multer({ storage: storageadminImage });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("server", "public", "uploads")); // Destination folder where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Unique filename generation
    const ext = path.extname(file.originalname); // Extract file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Set filename
  },
});

const upload = multer({ storage: storage });

const storeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file:", file);
    if (file.fieldname === "image") {
      let newpath = path.join("server", "public", "uploads", "store", "image");
      console.log("newpath:", newpath);
      cb(null, newpath); // Set destination for images
    } else if (file.fieldname === "logo") {
      let newpath = path.join("server", "public", "uploads", "store", "logo");
      console.log("newpath:", newpath);
      cb(null, newpath); // Set destination for logos
    } else {
      console.log("error multer Invalid field name:", file.fieldname);
      cb(new Error("Invalid field name"));
    }
  },
  filename: function (req, file, cb) {
    console.log("file:", file);
    let newname = Date.now() + "-" + file.originalname;
    console.log("newname:", newname);
    cb(null, newname); // Use unique filenames
  },
});
const Storeupload = multer({ storage: storeStorage });

const managerAndStoreStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file:", file);
    if (file.fieldname === "image") {
      let newpath = path.join("server", "public", "uploads", "store", "image");
      console.log("newpath:", newpath);
      cb(null, newpath); // Set destination for images
    } else if (file.fieldname === "logo") {
      let newpath = path.join("server", "public", "uploads", "store", "logo");
      console.log("newpath:", newpath);
      cb(null, newpath); // Set destination for logos
    } else if (file.fieldname === "profileImage") {
      let newpath = path.join("server", "public", "uploads", "profileImage");
      console.log("newpath:", newpath);
      cb(null, newpath); // Set destination for logos
    } else {
      console.log("error multer Invalid field name:", file.fieldname);
      cb(new Error("Invalid field name"));
    }
  },
  filename: function (req, file, cb) {
    console.log("file:", file);
    let newname = Date.now() + "-" + file.originalname;
    console.log("newname:", newname);
    cb(null, newname); // Use unique filenames
  },
});
const managerAndStoreupload = multer({ storage: managerAndStoreStorage });


const DoctorImagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file:", file);
    if (file.fieldname === "profileImage") {
      let newpath = path.join("server", "public", "uploads", "profileImage");
      console.log("newpath:", newpath);
      cb(null, newpath); // Set destination for profile images
    } else if (file.fieldname === "doctorSign") {
      let newpath = path.join("server", "public", "uploads", "doctorSign");
      console.log("newpath:", newpath);
      cb(null, newpath); // Set destination for doctor signatures
    } else {
      console.log("error multer Invalid field name:", file.fieldname);
      cb(new Error("Invalid field name"));
    }
  },
  filename: function (req, file, cb) {
    console.log("file:", file);
    let newname = Date.now() + "-" + file.originalname;
    console.log("newname:", newname);
    cb(null, newname); // Use unique filenames
  },
});

const uploadDoctorImages = multer({ storage: DoctorImagesStorage });


module.exports = {
  isValidEmail,
  isValidPassword,
  toObjectId,
  idValidObjectId,
  upload,
  uploadAdminImage,
  uploadDoctorImages,
  Storeupload,
  managerAndStoreupload
};
