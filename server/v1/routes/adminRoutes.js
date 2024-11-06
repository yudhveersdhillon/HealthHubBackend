var express = require("express");
var route = express.Router();
const { upload, uploadAdminImage, Storeupload } = require("../../utils/commonUtils");

var authCheck = require("../../auth/jwtAuthorized");

const adminController = require("../controllers/adminController");
let adminRepo = new adminController();


//  Create an Admin 
route.post("/register", uploadAdminImage.single("profileImage"), adminRepo.adminRegister);
route.post("/login", adminRepo.login);
route.post("/getstores", authCheck, adminRepo.getAllStores);
route.post("/getstoreusers", authCheck, adminRepo.getAllStoreUsers);
route.get("/listing", adminRepo.adminListing);
route.get("/list/:id", authCheck, adminRepo.getAdminbyId);
route.put(
  "/update/:id",
  authCheck,
  uploadAdminImage.single("profileImage"),
  adminRepo.updateAdmin
);
route.delete("/delete/:id", authCheck, adminRepo.deleteAdmin);

//  Store CRUD Starts

route.post(
  "/store/register",
  authCheck,
  Storeupload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  adminRepo.storeRegister
);
route.get("/store/list", authCheck, adminRepo.getStoreList);
route.get("/store/:id", authCheck, adminRepo.getStoreById);
route.put(
  "/store/update/:id",
  authCheck,
  Storeupload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  adminRepo.storeUpdate
);
route.delete("/store/delete/:id", authCheck, adminRepo.deleteStore);
//  Store CRUD Ends

//Get User Visits
route.get("/user/visits/:managerId", authCheck, adminRepo.getUserVisits);
route.get("/user/allvisit/data", authCheck, adminRepo.getallUserVisits);

route.get(
  "/user/visits/count/:managerId",
  authCheck,
  adminRepo.getUserVisitsCounts
);
route.get("/user/:id", authCheck, adminRepo.getUserById);
route.put("/user/update/:id", authCheck, adminRepo.updateUser);

// Terms and Conditions

route.post(
  "/create/termsandconditions",
  authCheck,
  adminRepo.createTermsAndConditions
);
route.post("/create/settings", authCheck, adminRepo.createSettings);

route.get("/setting/data", authCheck, adminRepo.getSetting);
route.get(
  "/termsandconditions/:key",
  authCheck,
  adminRepo.getTermsAndConditions
);
route.get("/login/counts", authCheck, adminRepo.getLoginCounts);
route.get("/manager/counts/:id", authCheck, adminRepo.getManagerCounts);

// Login Types
route.get("/user/login/counts", authCheck, adminRepo.getUserLoginCounts);
route.get("/user/visit/counts", authCheck, adminRepo.getUserVisitCounts);

// Store Crud
route.post("/create/manager", authCheck, adminRepo.createManager);
route.put("/update/manager/:id", authCheck, adminRepo.updateManager);
route.get("/manager/list", authCheck, adminRepo.getManagerList);
route.get("/manager/list/:id", authCheck, adminRepo.getManagerListById);
route.delete("/manager/delete/:id", authCheck, adminRepo.deleteManager);

// User
route.post("/create/user", authCheck, adminRepo.createUser);
route.put("/update/user/:id", authCheck, adminRepo.updateAdminUser);
route.get("/user/listing/data", authCheck, adminRepo.getAdminUserList);
route.get("/user/listing/:id", authCheck, adminRepo.getAdminUser);
route.delete("/delete/user/:id", authCheck, adminRepo.deleteAdminUser);
route.put("/update/password/:id", authCheck, adminRepo.updateAdminUserPassword);

// Radius
route.post("/update/radius", authCheck, adminRepo.createAndUpdateRadius);

// OnBoarding Routes
route.post(
  "/onboarding/create",
  authCheck,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  adminRepo.onboardingCreate
);
route.get("/onboarding/list", authCheck, adminRepo.onboardingList);
route.get("/onboarding/:language", authCheck, adminRepo.onboardingListById);

route.put(
  "/onboarding/update/:id",
  authCheck,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  adminRepo.onboardingUpdate
);
route.delete("/delete/:id", authCheck, adminRepo.deleteOnboarding);

route.put("/change/password/:id", authCheck, adminRepo.updateAdminPassword);
route.post("/create/agelimit/:id", authCheck, adminRepo.createAgeLimit);
route.get("/agelimit/data/:storeId", authCheck, adminRepo.getAgeLimitData);
route.get("/stores/data/:managerId", authCheck, adminRepo.getManagerStoresDataAdmin);
route.get("/count/data/:managerId", authCheck, adminRepo.getManagerCountVisit);
// all Stores for Dropdown 
route.get("/store/list/dropdown", authCheck, adminRepo.getStoreListDropdown);
route.get("/store/list/manager/dropdown/:id", authCheck, adminRepo.getStoreListManagerDropdown);

module.exports = route;
