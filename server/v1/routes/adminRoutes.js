var express = require("express");
var route = express.Router();
const { upload, uploadAdminImage, Storeupload } = require("../../utils/commonUtils");

var authCheck = require("../../auth/jwtAuthorized");

const adminController = require("../controllers/adminController");
let adminRepo = new adminController();


// Admin CRUD

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

// Doctor CRUD


route.post("/doctor/register", uploadAdminImage.single("profileImage"), adminRepo.adminDoctorRegister);
route.get("/doctor/list", authCheck, adminRepo.getAllDoctorList);
route.get("/doctor/list/:id", authCheck, adminRepo.getDoctorbyId);
route.put(
    "/doctor/update/:id",
    authCheck,
    uploadAdminImage.single("profileImage"),
    adminRepo.updateDoctor
);
route.delete("/doctor/delete/:id", authCheck, adminRepo.deleteDoctor);


//Staff CRUD


route.post("/staff/register", uploadAdminImage.single("profileImage"), adminRepo.adminStaffRegister);
route.get("/staff/list", authCheck, adminRepo.getAllStaffList);
route.get("/staff/list/:id", authCheck, adminRepo.getStaffbyId);
route.put(
    "/staff/update/:id",
    authCheck,
    uploadAdminImage.single("profileImage"),
    adminRepo.updateStaff
);
route.delete("/staff/delete/:id", authCheck, adminRepo.deleteStaff);


module.exports = route;
