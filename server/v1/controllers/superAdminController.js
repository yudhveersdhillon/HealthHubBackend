const service = require("../services/superAdminService");
const CONFIG = require("../../config/appConfig");

let superAdminService = new service();

class superAdminController {
    adminRegister(req, res) {
        superAdminService
            .adminRegister(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }

    login(req, res) {
        superAdminService
            .loginAdmin(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }
    getAdminbyId(req, res) {
        superAdminService
            .getAdminById(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }

    updateAdmin(req, res) {
        superAdminService
            .updateAdmin(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }

    deleteAdmin(req, res) {
        superAdminService
            .deleteAdmin(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }
    updateUser(req, res) {
        superAdminService
            .updateUser(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }


    adminDoctorRegister(req, res) {
        superAdminService
            .adminDoctorRegister(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }
    getAllDoctorList(req, res) {
        superAdminService
            .getAllDoctorList(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }

    getDoctorbyId(req, res) {
        superAdminService
            .getDoctorbyId(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }

    updateDoctor(req, res) {
        superAdminService
            .updateDoctor(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }

    deleteDoctor(req, res) {
        superAdminService
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
            superAdminService
            .adminStaffRegister(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }

    getAllStaffList(req, res) {
        superAdminService
            .getAllStaffList(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }

    getStaffbyId(req, res) {
        superAdminService
            .getStaffbyId(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }

    updateStaff(req, res) {
        superAdminService
            .updateStaff(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }

    deleteStaff(req, res) {
        superAdminService
            .deleteStaff(req, res)
            .then((result) => {
                return res.success(result.code, result.message, result.data);
            })
            .catch((error) => {
                return res.reject(error.code, error.message);
            });
    }
}

module.exports = superAdminController;
