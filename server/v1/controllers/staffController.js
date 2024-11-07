const service = require("../services/staffServices");
const CONFIG = require("../../config/appConfig");

let staffService = new service();

class staffController {

  userSignUp(req, res) {
    userService
      .userSignUp(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  Stafflogin(req, res) {
    staffService
      .Stafflogin(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  updateUserDeatails(req, res) {
    userService
      .updateUserDeatails(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  userLogout(req, res) {
    userService
      .userLogout(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  onboardingData(req, res) {
    userService
      .onboardingData(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  sendEmailForgotPasswordforStaff(req, res) {
    staffService
      .sendEmailForgotPasswordforStaff(req, res) 
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  verifyEmailOtpforStaff(req, res) {
    staffService
      .verifyEmailOtpforStaff(req, res) 
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  updatePasswordforStaffEmail(req, res) {
    staffService
      .updatePasswordforStaffEmail(req, res) 
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }


}

module.exports = staffController;
