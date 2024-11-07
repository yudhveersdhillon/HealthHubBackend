var express = require("express");
var route = express.Router();
const { upload, uploadAdminImage, Storeupload } = require("../../utils/commonUtils");

var authCheck = require("../../auth/jwtAuthorized");

const adminController = require("../controllers/adminController");
let adminRepo = new adminController();


//  Create an Admin 
route.post("/register", uploadAdminImage.single("profileImage"), adminRepo.adminRegister);
route.post("/login", adminRepo.login);
route.get("/list/:id", authCheck, adminRepo.getAdminbyId);
route.put(
    "/update/:id",
    authCheck,
    uploadAdminImage.single("profileImage"),
    adminRepo.updateAdmin
);
route.delete("/delete/:id", authCheck, adminRepo.deleteAdmin);

module.exports = route;
