var express = require("express");
var route = express.Router();

var userCheck = require("../../auth/userjwtAuthorized");

const userController = require("../controllers/staffController");

let userRepo = new userController();

route.post("/signUp", userRepo.userSignUp);

route.post("/login", userRepo.userLogin);

route.put("/update/details", userRepo.updateUserDeatails);

route.post("/logout", userCheck, userRepo.userLogout);

route.get("/onboarding/data", userRepo.onboardingData);





module.exports = route;
