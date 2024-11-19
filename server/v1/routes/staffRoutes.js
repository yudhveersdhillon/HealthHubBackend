var express = require("express");
var route = express.Router();

var userCheck = require("../../auth/userjwtAuthorized");

const staffController = require("../controllers/staffController");

let staffRepo = new staffController();



route.post("/login", staffRepo.Stafflogin);
route.post("/createappointment", staffRepo.CreateAppointment);
route.get("/patient/data/:id", staffRepo.getOldPatientData);

// route.put("/update/details", userRepo.updateUserDeatails);

// route.post("/logout", userCheck, userRepo.userLogout);

// route.get("/onboarding/data", userRepo.onboardingData);
route.post('/forgotpassword/email', staffRepo.sendEmailForgotPasswordforStaff);
route.post('/forgotpassword/verifyotp', staffRepo.verifyEmailOtpforStaff);
route.post('/update/password/:id', staffRepo.updatePasswordforStaffEmail);





module.exports = route;
