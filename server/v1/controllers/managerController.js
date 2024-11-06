const service = require("../services/managerService");
const CONFIG = require("../../config/appConfig");

let managerService = new service();

class managerController {
  login(req, res) {
    managerService
      .loginManager(req, res)
      .then((result) => {
        return res.success(result.code, "", result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  register(req, res) {
    managerService
      .registerManager(req, res)
      .then((result) => {
        return res.success(result.code, "", result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }


}

module.exports = managerController;
