var express = require("express");
var route = express.Router();
const { managerAndStoreupload } = require("../../utils/commonUtils");

var authCheck = require("../../auth/jwtAuthorized");

const managerController = require("../controllers/doctorController");
let managerRepo = new managerController();

route.post("/login", managerRepo.login);
route.post("/register", managerAndStoreupload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
]), managerRepo.register);


module.exports = route;
