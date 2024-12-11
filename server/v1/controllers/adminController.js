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
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  getAdminbyId(req, res) {
    adminService
      .getAdminById(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  updateAdmin(req, res) {
    adminService
      .updateAdmin(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  deleteAdmin(req, res) {
    adminService
      .deleteAdmin(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  updateUser(req, res) {
    adminService
      .updateUser(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }


  adminDoctorRegister(req, res) {
    adminService
      .adminDoctorRegister(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  getAllDoctorList(req, res) {
    adminService
      .getAllDoctorList(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  getDoctorbyId(req, res) {
    adminService
      .getDoctorbyId(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  updateDoctor(req, res) {
    adminService
      .updateDoctor(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  deleteDoctor(req, res) {
    adminService
      .deleteDoctor(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  adminStaffRegister
    (req, res) {
    adminService
      .adminStaffRegister(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  getAllStaffList(req, res) {
    adminService
      .getAllStaffList(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  getStaffbyId(req, res) {
    adminService
      .getStaffbyId(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  updateStaff(req, res) {
    adminService
      .updateStaff(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  deleteStaff(req, res) {
    adminService
      .deleteStaff(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  adminPatientRegister(req, res) {
    adminService
      .adminPatientRegister(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  getAllPatientList(req, res) {
    adminService
      .getAllPatientList(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  getPatientbyId(req, res) {
    adminService
      .getPatientbyId(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  deletePatient(req, res) {
    adminService
      .deletePatient(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  updatePatient(req, res) {
    adminService
      .updatePatient(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }

  deletePatientVitals(req, res) {
    adminService
      .deletePatientVitals(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  adminPatientVitalsRegister(req, res) {
    adminService
      .adminPatientVitalsRegister(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  getAllPatientVitalsList(req, res) {
    adminService
      .getAllPatientVitalsList(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  getPatientVitalsbyId(req, res) {
    adminService
      .getPatientVitalsbyId(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  updatePatientVitals(req, res) {
    adminService
      .updatePatientVitals(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }



  sendEmailForgotPasswordforAdmin(req, res) {
    adminService
      .sendEmailForgotPasswordforAdmin(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  verifyEmailOtpforAdmin(req, res) {
    adminService
      .verifyEmailOtpforAdmin(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
  updatePasswordforAdminEmail(req, res) {
    adminService
      .updatePasswordforAdminEmail(req, res)
      .then((result) => {
        return res.success(result.code, result.message, result.data);
      })
      .catch((error) => {
        return res.reject(error.code, error.message);
      });
  }
}

module.exports = adminController;
