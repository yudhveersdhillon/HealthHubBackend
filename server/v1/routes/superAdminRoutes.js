var express = require("express");
var route = express.Router();
const { upload, uploadAdminImage, uploadDoctorImages, Storeupload } = require("../../utils/commonUtils");

var authCheck = require("../../auth/superAdminjwtAuthorised");

const superAdminController = require("../controllers/superAdminController");
let superAdminRepo = new superAdminController();


// Admin CRUD

route.post("/login", superAdminRepo.login);
route.post("/hospital/register", authCheck, uploadAdminImage.single("profileImage"), superAdminRepo.adminRegister);
route.get("/admin/list", authCheck, superAdminRepo.getAdminList);
route.get("/hospital/all/list", authCheck, superAdminRepo.getAllHospitalList);
route.get("/hospital/list/:id", authCheck, superAdminRepo.getAdminbyId);
route.put(
    "/hospital/update/:id",
    authCheck,
    uploadAdminImage.single("profileImage"),
    superAdminRepo.updateAdmin
);
route.delete("/hospital/delete/:id", authCheck, superAdminRepo.deleteAdmin);

// Doctor CRUD


route.post("/hospital/doctor/register", authCheck, uploadDoctorImages.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "doctorSign", maxCount: 1 },
]), superAdminRepo.SuperadminDoctorRegister);
route.get("/hospital/alldoctor/list", authCheck, superAdminRepo.getAllDoctorList);
route.get("/hospital/doctor/list/:id", authCheck, superAdminRepo.getDoctorbyId);
route.put(
    "/hospital/doctor/update/:id",
    authCheck,
    uploadAdminImage.single("profileImage"),
    superAdminRepo.updateDoctor
);
route.delete("/hospital/doctor/delete/:id", authCheck, superAdminRepo.deleteDoctor);


//Staff CRUD


route.post("/hospital/staff/register", authCheck, uploadAdminImage.single("profileImage"), superAdminRepo.adminStaffRegister);
route.get("/hospital/staff/list", authCheck, superAdminRepo.getAllStaffList);
route.get("/hospital/staff/list/:id", authCheck, superAdminRepo.getStaffbyId);
route.put(
    "/hospital/staff/update/:id",
    authCheck,
    uploadAdminImage.single("profileImage"),
    superAdminRepo.updateStaff
);
route.delete("/hospital/staff/delete/:id", authCheck, superAdminRepo.deleteStaff);

//route.post('/create/template',authCheck, superAdminRepo.createTemplate);

module.exports = route;
