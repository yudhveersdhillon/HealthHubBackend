// const User = require("../../models/user");
require("dotenv").config();
const jwtUtil = require("../../utils/JwtUtils");
const CONFIG = require("../../config/appConfig");
const Util = require("../../utils/commonUtils");
const moment = require("moment");
const Admin = require("../../models/admin");
const Doctor = require("../../models/doctor");

const User = require("../../models/staff");

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");


class adminService {
  adminRegister(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        var adminData = req.body;
        if (req.file) {
          // File upload successful
          adminData.profileImage = `static/profileImage/${req.file.filename}`;
        } else {
          console.log("No file uploaded");
        }
        if (adminData.email && !Util.isValidEmail(adminData.email)) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_EMAIL,
          });
        } else if (adminData.password && !Util.isValidPassword(adminData.password)) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_PASSWORD,
          });
        }
        try {
          const exists = await Admin.findOne({ email: adminData.email.toLowerCase(), status: { $ne: 2 } });
          if (exists) {
            return reject({
              code: CONFIG.ERROR_CODE,
              message: CONFIG.ERR_EMAIL_ALREADY_TAKEN,
            });
          }

          let adminInstance = new Admin(adminData);
          adminInstance.password = await adminInstance.setPassword(adminData.password);
          const result = await adminInstance.save();
          const data = JSON.parse(JSON.stringify(result));
          delete data.password;

          resolve({
            code: CONFIG.SUCCESS_CODE,
            message: CONFIG.SUCCESS_ADMIN_CREATION,
            data: data,
          });

        } catch (err) {
          console.error("Database error:", err.message);
          return reject({
            code: CONFIG.ERROR_CODE,
            message: err.message,
          });
        }

      } catch (err) {
        console.error("Unexpected error:", err.message);
        return reject({
          code: CONFIG.ERROR_CODE,
          message: err.message,
        });
      }
    });
  }
  loginAdmin(req, res) {
    return new Promise(async function (resolve, reject) {
      var body = req.body;
      if (!body.password)
        return reject({
          code: CONFIG.ERROR_CODE,
          message: CONFIG.ERR_MISSING_PASSWORD,
        });
      else if (!body.email)
        return reject({
          code: CONFIG.ERROR_CODE,
          message: CONFIG.ERR_MISSING_EMAIL,
        });
      Admin.findOne({
        email: body.email.toLowerCase(),
        status: CONFIG.ACTIVE_STATUS,
      })
        .select("+password")
        .then(async (user) => {
          if (!user)
            return reject({
              code: CONFIG.ERROR_CODE_FORBIDDEN,
              message: CONFIG.EMAIL_NOT_CORRECT,
            });
          const iscorrect = await user.comparePassword(body.password);
          if (!iscorrect)
            return reject({
              code: CONFIG.ERROR_CODE_FORBIDDEN,
              message: CONFIG.PASS_NOT_CORRECT,
            });
          var data = JSON.parse(JSON.stringify(user));
          delete data.password;

          let token = jwtUtil.issue({
            email: data.email,
            _id: data._id,
            name: data.name,
            role: data.role,
          });
          data.token = token;
          return resolve({
            code: CONFIG.SUCCESS_CODE,
            message: CONFIG.ADMIN_SUCCESSFUL_LOGIN,
            data: data,
          });
        })
        .catch((err) => {
          return reject({ code: CONFIG.ERROR_CODE, message: err.message });
        });
    });
  }
  getAdminById(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const adminId = req.params.id;
        // Validate adminId
        if (!adminId) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ADMIN_ID_MISSED,
          });
        }
        // Check if adminId is a valid ObjectId
        if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
          reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ID_NOT_CORRECT,
          });
          return;
        }
        const admin = await Admin.findOne({
          _id: adminId,
          status: { $ne: 2 }
        });

        if (!admin) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ADMIN_NOT_FOUND,
          });
        }
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_ADMIN_RETRIEVAL,
          data: admin,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }
  // update admin details

  updateAdmin(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const adminId = req.params.id;
        let adminData = req.body;
        if (req.file) {
          // File upload successful
          const adminDetails = await Admin.findOne({ email: adminData.email });
          if (req.file && adminDetails.profileImage) {
            const filePath = path.join(
              __dirname,
              "../../",
              "public",
              "uploads",
              "profileImage",
              adminDetails.profileImage.replace("static/", "")
            );
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error removing old file:", err.message);
              } else {
                console.log("File removed successfully");
              }
              adminData.profileImage = req.file
                ? `static/profileImage/${req.file.filename}`
                : null;
              // Pass the uploaded data to the next middleware function
            });
          }
        }
        const admin = await Admin.findOne({ _id: adminId });
        let adminInstance = new Admin(adminData);
        if (!admin) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_EMAIL,
          });
        }
        await Admin.updateOne(
          { _id: adminId },
          { $set: adminData },
          { new: true, upsert: true }
        );
        const updatedAdmin = await Admin.findOne({ _id: adminId });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_ADMIN_UPDATE,
          data: updatedAdmin,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  deleteAdmin(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const adminId = req.params.id;
        const admin = await Admin.findOne({ _id: adminId });
        if (!admin) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_EMAIL,
          });
        }

        // Delete Admin Soft Delete
        await Admin.updateOne({ _id: adminId }, { status: 2 }, { new: true });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_ADMIN_DELETED,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  adminDoctorRegister(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        var doctorData = req.body;
        if (req.file) {
          // File upload successful
          doctorData.profileImage = `static/profileImage/${req.file.filename}`;
        } else {
          console.log("No file uploaded");
        }
        if (doctorData.email && !Util.isValidEmail(doctorData.email)) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_EMAIL,
          });
        } else if (doctorData.password && !Util.isValidPassword(doctorData.password)) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_PASSWORD,
          });
        }
        try {
          const exists = await Doctor.findOne({ email: doctorData.email.toLowerCase(), status: { $ne: 2 } });
          if (exists) {
            return reject({
              code: CONFIG.ERROR_CODE,
              message: CONFIG.ERR_EMAIL_ALREADY_TAKEN,
            });
          }

          let doctorInstance = new Doctor(doctorData);
          doctorInstance.password = await doctorInstance.setPassword(doctorData.password);
          const result = await doctorInstance.save();
          const data = JSON.parse(JSON.stringify(result));
          delete data.password;

          resolve({
            code: CONFIG.SUCCESS_CODE,
            message: CONFIG.SUCCESS_DOCTOR_CREATION,
            data: data,
          });

        } catch (err) {
          console.error("Database error:", err.message);
          return reject({
            code: CONFIG.ERROR_CODE,
            message: err.message,
          });
        }

      } catch (err) {
        console.error("Unexpected error:", err.message);
        return reject({
          code: CONFIG.ERROR_CODE,
          message: err.message,
        });
      }
    });

  }


  getAllDoctorList(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const word = req.query.word;
        const doctorList = await Doctor.find({
          status: { $ne: 2 },
          $or: [
            { name: { $regex: new RegExp(word, "i") } },
            { email: { $regex: new RegExp(word, "i") } },
          ],
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
        const doctorCount = await Doctor.countDocuments({ status: { $ne: 2 } })

        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_DOCTOR_LIST,
          data: { doctorList, doctorCount }
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  getDoctorbyId(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const doctorId = req.params.id;
        // Validate adminId
        if (!doctorId) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.DOCTOR_ID_MISSED,
          });
        }
        // Check if adminId is a valid ObjectId
        if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
          reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ID_NOT_CORRECT,
          });
          return;
        }
        const doctor = await Doctor.findOne({
          _id: doctorId,
          status: { $ne: 2 }
        });

        if (!doctor) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.DOCTOR_NOT_FOUND,
          });
        }
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_DOCTOR_RETRIEVAL,
          data: doctor,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  updateDoctor(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const doctorId = req.params.id;
        const doctor = await Doctor.findOne({ _id: doctorId });
        if (!doctor) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.NOT_FOUND_DOCTOR,
          });
        }
        let doctorData = req.body;
        if (req.file) {
          // File upload successful
          const doctorDetails = await Doctor.findOne({ email: adminData.email });
          if (req.file && doctorDetails.profileImage) {
            const filePath = path.join(
              __dirname,
              "../../",
              "public",
              "uploads",
              "profileImage",
              doctorDetails.profileImage.replace("static/", "")
            );
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error removing old file:", err.message);
              } else {
                console.log("File removed successfully");
              }
              doctorData.profileImage = req.file
                ? `static/profileImage/${req.file.filename}`
                : null;
              // Pass the uploaded data to the next middleware function
            });
          }
        }

        await Doctor.updateOne(
          { _id: doctorId },
          { $set: doctorData },
          { new: true, upsert: true }
        );
        const updateDoctor = await Doctor.findOne({ _id: doctorId });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_DOCTOR_UPDATE,
          data: updateDoctor,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  deleteDoctor(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const doctorId = req.params.id;
        const doctor = await Admin.findOne({ _id: doctorId });
        if (!doctor) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.NOT_FOUND_DOCTOR,
          });
        }

        await Doctor.updateOne({ _id: doctorId }, { status: 2 }, { new: true });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_DOCTOR_DELETED,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  updateUser(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const userId = req.params.id;
        const userUpdateData = req.body;
        const userUpdatedData = await User.findOneAndUpdate(
          { _id: userId },
          { $set: userUpdateData },
          { new: true }
        );
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_USER_DATA_UPDATED,
          data: userUpdatedData,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }
}

module.exports = adminService;
