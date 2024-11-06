const service = require("../services/doctorService"); // Update to point to the doctor service
const CONFIG = require("../../config/appConfig");

let doctorService = new service();

class doctorController {
  login(req, res) {
    doctorService
      .loginDoctor(req, res) // Update to loginDoctor
      .then((result) => {
        return res.success(result.code, "", result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  register(req, res) {
    doctorService
      .registerDoctor(req, res) // Update to registerDoctor
      .then((result) => {
        return res.success(result.code, "", result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
}

module.exports = doctorController;
