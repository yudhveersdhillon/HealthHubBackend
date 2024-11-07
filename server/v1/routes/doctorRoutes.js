var express = require("express");
var route = express.Router();
const { managerAndStoreupload } = require("../../utils/commonUtils");

var authCheck = require("../../auth/jwtAuthorized");

const doctorController = require("../controllers/doctorController");
let doctorRepo = new doctorController();

route.post("/login", doctorRepo.Doctorlogin);

// route.post("/login", managerRepo.login);
// route.post("/register", managerAndStoreupload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "logo", maxCount: 1 },
//     { name: "profileImage", maxCount: 1 },
// ]), managerRepo.register);


module.exports = route;
