const service = require("../services/adminService");
const CONFIG = require("../../config/appConfig");

let adminService = new service();

class adminController {
  adminRegister(req, res) {
    adminService
      .adminRegister(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }




  login(req, res) {
    adminService
      .loginAdmin(req, res)
      .then((result) => {
        return res.success(result.code, "", result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  updateUser(req, res) {
    adminService
      .updateUser(req, res)
      .then((result) => {
        return res.success(result.code, "", result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }


}

module.exports = adminController;