var express = require("express");
var route = express.Router();

var userCheck = require("../../auth/userjwtAuthorized");

const staffController = require("../controllers/staffController");

let staffRepo = new staffController();



route.post("/login", staffRepo.Stafflogin);

// route.put("/update/details", userRepo.updateUserDeatails);

// route.post("/logout", userCheck, userRepo.userLogout);

// route.get("/onboarding/data", userRepo.onboardingData);





module.exports = route;