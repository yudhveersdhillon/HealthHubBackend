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

// Patient register by admin

route.post("/patient/register", adminRepo.adminPatientRegister);
route.get("/patient/list", authCheck, adminRepo.getAllPatientList);
route.get("/patient/list/:id", authCheck, adminRepo.getPatientbyId);
route.put(
    "/patient/update/:id",
    authCheck,
    adminRepo.updatePatient
);
route.delete("/patient/delete/:id", authCheck, adminRepo.deletePatient);

// Add Patient Vitals

route.post("/vitals/patient/add", adminRepo.adminPatientVitalsRegister);
route.get("/vitals/patient/list", authCheck, adminRepo.getAllPatientVitalsList);
route.get("/vitals/patient/list/:id", authCheck, adminRepo.getPatientVitalsbyId);
route.put(
    "/vitals/patient/update/:id",
    authCheck,
    adminRepo.updatePatientVitals
);
route.delete("/vitals/patient/delete/:id", authCheck, adminRepo.deletePatientVitals);

// Add Prescription

route.post("/prescription/patient/add", adminRepo.adminPatientPrescriptionRegister);
route.get("/prescription/patient/list", authCheck, adminRepo.getAllPatientPrescriptionList);
route.get("/prescription/patient/list/:id", authCheck, adminRepo.getPatientPrescriptionbyId);
route.put(
    "/prescription/patient/update/:id",
    authCheck,
    adminRepo.updatePatientPrescription
);
route.delete("/prescription/patient/delete/:id", authCheck, adminRepo.deletePrescriptionVitals);



//Forgot Password

route.post('/forgotpassword/email', adminRepo.sendEmailForgotPasswordforAdmin);
route.post('/forgotpassword/verifyotp', adminRepo.verifyEmailOtpforAdmin);
route.post('/update/password/:id', adminRepo.updatePasswordforAdminEmail);


module.exports = route;
