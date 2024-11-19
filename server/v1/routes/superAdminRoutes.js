var express = require("express");
var route = express.Router();
const { upload, uploadAdminImage, Storeupload } = require("../../utils/commonUtils");

var authCheck = require("../../auth/jwtAuthorized");

const superAdminController = require("../controllers/superAdminController");
let superAdminRepo = new superAdminController();


// Admin CRUD

route.post("/login", superAdminRepo.login);
route.post("/admin/register", uploadAdminImage.single("profileImage"), superAdminRepo.adminRegister);
route.get("/admin/list/:id", authCheck, superAdminRepo.getAdminbyId);
route.put(
    "/admin/update/:id",
    authCheck,
    uploadAdminImage.single("profileImage"),
    superAdminRepo.updateAdmin
);
route.delete("/admin/delete/:id", authCheck, superAdminRepo.deleteAdmin);

// Doctor CRUD


route.post("/doctor/register", uploadAdminImage.single("profileImage"), superAdminRepo.adminDoctorRegister);
route.get("/doctor/list", authCheck, superAdminRepo.getAllDoctorList);
route.get("/doctor/list/:id", authCheck, superAdminRepo.getDoctorbyId);
route.put(
    "/doctor/update/:id",
    authCheck,
    uploadAdminImage.single("profileImage"),
    superAdminRepo.updateDoctor
);
route.delete("/doctor/delete/:id", authCheck, superAdminRepo.deleteDoctor);


//Staff CRUD


route.post("/staff/register", uploadAdminImage.single("profileImage"), superAdminRepo.adminStaffRegister);
route.get("/staff/list", authCheck, superAdminRepo.getAllStaffList);
route.get("/staff/list/:id", authCheck, superAdminRepo.getStaffbyId);
route.put(
    "/staff/update/:id",
    authCheck,
    uploadAdminImage.single("profileImage"),
    superAdminRepo.updateStaff
);
route.delete("/staff/delete/:id", authCheck, superAdminRepo.deleteStaff);


module.exports = route;
