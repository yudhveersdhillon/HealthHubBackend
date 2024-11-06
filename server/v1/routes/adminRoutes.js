var express = require("express");
var route = express.Router();
const { upload, uploadAdminImage, Storeupload } = require("../../utils/commonUtils");

var authCheck = require("../../auth/jwtAuthorized");

const adminController = require("../controllers/adminController");
let adminRepo = new adminController();


//  Create an Admin 
route.post("/register", uploadAdminImage.single("profileImage"), adminRepo.adminRegister);
route.post("/login", adminRepo.login);

module.exports = route;
