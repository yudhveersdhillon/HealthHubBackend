var express = require("express");
var route = express.Router();
const { managerAndStoreupload } = require("../../utils/commonUtils");

var authCheck = require("../../auth/jwtAuthorized");

const managerController = require("../controllers/managerController");
let managerRepo = new managerController();

route.post("/login", managerRepo.login);
route.post("/register", managerAndStoreupload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
]), managerRepo.register);
route.post("/getusers", authCheck, managerRepo.getStoreUsers);
route.post("/get/nearbystores/data", authCheck, managerRepo.getNearByStoreData);
route.get("/get/stores/data/:managerId", authCheck, managerRepo.getManagerStoresData);
route.get("/get/uservisits/data/:storeId", authCheck, managerRepo.getStoreUserVisitsData);

module.exports = route;
