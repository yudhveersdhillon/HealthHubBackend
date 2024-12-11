// const User = require("../../models/user");
require("dotenv").config();
const jwtUtil = require("../../utils/JwtUtils");
const CONFIG = require("../../config/appConfig");
const Util = require("../../utils/commonUtils");
const moment = require("moment");
const Admin = require("../../models/admin");
const Doctor = require("../../models/doctor");
const Staff = require("../../models/staff");
const Patient = require("../../models/patient");
const PatientVitals = require("../../models/vitals");
const PatientPrescription = require("../../models/prescription");

const User = require("../../models/staff");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const ObjectId = require("mongoose").Types.ObjectId;

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

  updateAdmin(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const adminId = req.params.id;
        let adminData = req.body;

        if (req.file) {
          // File upload successful
          const adminDetails = await Admin.findOne({ _id: adminId });
          if (adminDetails && req.file) {
            if (adminDetails.profileImage) {
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
            } else if (req.file) {
              adminData.profileImage = req.file
                ? `static/profileImage/${req.file.filename}`
                : null;
            }
          }
        }
        const admin = await Admin.findOne({ _id: adminId });
        //let adminInstance = new Admin(adminData);
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
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        const word = req.query.search;
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
        const doctorCount = await Doctor.countDocuments({
          status: { $ne: 2 },
          $or: [
            { name: { $regex: new RegExp(word, "i") } },
            { email: { $regex: new RegExp(word, "i") } },
          ],
        })

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
        let doctorData = req.body;

        const doctor = await Doctor.findOne({ _id: doctorId });
        if (!doctor) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.NOT_FOUND_DOCTOR,
          });
        }

        if (req.file) {
          // File upload successful
          if (typeof doctor.profileImage === 'string' && doctor.profileImage.includes('static/profileImage/')) {
            const filePath = path.join(
              __dirname,
              "../../",
              "public",
              "uploads",
              "profileImage",
              doctor.profileImage.replace("static/", "")
            );
            try {
              await fs.promises.unlink(filePath);
              console.log("Old profile image removed successfully.");
            } catch (err) {
              console.error("Error removing old file:", err.message);
            }
          }

          // Update the new profile image path
          doctorData.profileImage = `static/profileImage/${req.file.filename}`;
        }

        const updatedDoctor = await Doctor.findOneAndUpdate(
          { _id: doctorId },
          { $set: doctorData },
          { new: true }
        );

        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_DOCTOR_UPDATE,
          data: updatedDoctor,
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
        const doctor = await Doctor.findOne({ _id: doctorId });
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


  adminStaffRegister(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        var staffData = req.body;
        if (req.file) {
          // File upload successful
          staffData.profileImage = `static/profileImage/${req.file.filename}`;
        } else {
          console.log("No file uploaded");
        }
        if (staffData.email && !Util.isValidEmail(staffData.email)) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_EMAIL,
          });
        } else if (staffData.password && !Util.isValidPassword(staffData.password)) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_PASSWORD,
          });
        }
        try {
          const exists = await Staff.findOne({ email: staffData.email.toLowerCase(), status: { $ne: 2 } });
          if (exists) {
            return reject({
              code: CONFIG.ERROR_CODE,
              message: CONFIG.ERR_EMAIL_ALREADY_TAKEN,
            });
          }

          let staffInstance = new Staff(staffData);
          staffInstance.password = await staffInstance.setPassword(staffData.password);
          const result = await staffInstance.save();
          const data = JSON.parse(JSON.stringify(result));
          delete data.password;

          resolve({
            code: CONFIG.SUCCESS_CODE,
            message: CONFIG.SUCCESS_STAFF_CREATION,
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

  getAllStaffList(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        const word = req.query.search;
        const staffList = await Staff.find({
          status: { $ne: 2 },
          $or: [
            { name: { $regex: new RegExp(word, "i") } },
            { email: { $regex: new RegExp(word, "i") } },
          ],
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
        const staffCount = await Staff.countDocuments({
          status: { $ne: 2 },
          $or: [
            { name: { $regex: new RegExp(word, "i") } },
            { email: { $regex: new RegExp(word, "i") } },
          ],
        })

        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_STAFF_LIST,
          data: { staffList, staffCount }
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  getStaffbyId(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const staffId = req.params.id;
        // Validate adminId
        if (!staffId) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.STAFF_ID_MISSED,
          });
        }
        // Check if adminId is a valid ObjectId
        if (!staffId || !mongoose.Types.ObjectId.isValid(staffId)) {
          reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ID_NOT_CORRECT,
          });
          return;
        }
        const staff = await Staff.findOne({
          _id: staffId,
          status: { $ne: 2 }
        });

        if (!staff) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.STAFF_NOT_FOUND,
          });
        }
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_STAFF_RETRIEVAL,
          data: staff,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  updateStaff(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const staffId = req.params.id;
        const staff = await Staff.findOne({ _id: staffId });
        if (!staff) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.NOT_FOUND_STAFF,
          });
        }
        let staffData = req.body;
        if (req.file) {
          // File upload successful
          const staffDetails = await Staff.findOne({ email: staffData.email });
          if (req.file && staffDetails.profileImage) {
            const filePath = path.join(
              __dirname,
              "../../",
              "public",
              "uploads",
              "profileImage",
              staffDetails.profileImage.replace("static/", "")
            );
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error removing old file:", err.message);
              } else {
                console.log("File removed successfully");
              }
              staffData.profileImage = req.file
                ? `static/profileImage/${req.file.filename}`
                : null;
              // Pass the uploaded data to the next middleware function
            });
          } else if (req.file) {
            staffData.profileImage = req.file
              ? `static/profileImage/${req.file.filename}`
              : null;
          }
        }

        await Staff.updateOne(
          { _id: staffId },
          { $set: staffData },
          { new: true, upsert: true }
        );
        const updateStaff = await Staff.findOne({ _id: staffId });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_STAFF_UPDATE,
          data: updateStaff,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  deleteStaff(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const staffId = req.params.id;
        const staff = await Staff.findOne({ _id: staffId });
        if (!staff) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.NOT_FOUND_STAFF,
          });
        }

        await Staff.updateOne({ _id: staffId }, { status: 2 }, { new: true });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_STAFF_DELETED,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  adminPatientRegister(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        var patientData = req.body;
        try {
          const exists = await Patient.findOne({ firstName: staffData.patientData.toLowerCase(), phone: patientData.phone, status: { $ne: 2 } });
          if (exists) {
            return reject({
              code: CONFIG.ERROR_CODE,
              message: CONFIG.SAME_PATIENT_ALREADY_EXISTS,
            });
          }

          let patientInstance = new Patient(patientData);
          const result = await patientInstance.save();
          const data = JSON.parse(JSON.stringify(result));

          resolve({
            code: CONFIG.SUCCESS_CODE,
            message: CONFIG.SUCCESS_PATIENT_CREATION,
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


  getAllPatientList(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        const word = req.query.search;
        const patientList = await Patient.find({
          status: { $ne: 2 },
          $or: [
            { firstName: { $regex: new RegExp(word, "i") } },
            { email: { $regex: new RegExp(word, "i") } },
            { phone: { $regex: new RegExp(word, "i") } },
          ],
        })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
        const patientCount = await Patient.countDocuments({
          status: { $ne: 2 },
          $or: [
            { firstName: { $regex: new RegExp(word, "i") } },
            { email: { $regex: new RegExp(word, "i") } },
            { phone: { $regex: new RegExp(word, "i") } },
          ],
        })

        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_STAFF_LIST,
          data: { patientList, patientCount }
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  getPatientbyId(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const patientId = req.params.id;
        // Validate adminId
        if (!patientId) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.PATIENT_ID_MISSED,
          });
        }
        // Check if adminId is a valid ObjectId
        if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
          reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ID_NOT_CORRECT,
          });
          return;
        }
        const patient = await Patient.findOne({
          _id: patientId,
          status: { $ne: 2 }
        });

        if (!patient) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.PATIENT_NOT_FOUND,
          });
        }
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_PATIENT_RETRIEVAL,
          data: patient,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }




  updatePatient(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const patientId = req.params.id;
        const patient = await Patient.findOne({ _id: patientId });
        if (!patient) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.PATIENT_NOT_FOUND,
          });
        }
        let patientData = req.body;


        await Patient.updateOne(
          { _id: patientId },
          { $set: patientData },
          { new: true, upsert: true }
        );
        const updatePatient = await Patient.findOne({ _id: patientId });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_PATIENT_UPDATE,
          data: updatePatient,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  deletePatient(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const patientId = req.params.id;
        const patient = await Patient.findOne({ _id: patientId });
        if (!patient) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.PATIENT_NOT_FOUND,
          });
        }

        await Patient.updateOne({ _id: patientId }, { status: 2 }, { new: true });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_PATIENT_DELETED,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  adminPatientVitalsRegister(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        var patientVitalsData = req.body;
        try {
          // const exists = await PatientVitals.findOne({ patientId: patientVitalsData.patientId,vitalsDate:Date.now, status: { $ne: 2 } });
          // if (exists) {
          //   return reject({
          //     code: CONFIG.ERROR_CODE,
          //     message: CONFIG.SAME_VITALS_ALREADY_EXISTS,
          //   });
          // }

          let patientVitalsInstance = new PatientVitals(patientVitalsData);
          const result = await patientVitalsInstance.save();
          const data = JSON.parse(JSON.stringify(result));

          resolve({
            code: CONFIG.SUCCESS_CODE,
            message: CONFIG.SUCCESS_PATIENT_VITALS_CREATION,
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

  getAllPatientVitalsList(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        const word = req.query.search;
        const patientVitalsList = await PatientVitals.aggregate([
          {
            $match: {
              status: { $ne: 2 },
            }
          },
          {
            $lookup: {
              from: 'patients', // Assuming your patient collection is named 'patients'
              localField: 'patientId',
              foreignField: '_id',
              as: 'patientDetails',
            }
          },
          {
            $unwind: '$patientDetails',
          },
          {
            $match: {
              $or: [
                { 'patientDetails.firstName': { $regex: new RegExp(word, 'i') } },
                { 'patientDetails.email': { $regex: new RegExp(word, 'i') } },
                { 'patientDetails.phone': { $regex: new RegExp(word, 'i') } },
              ]
            }
          },
          {
            $sort: { createdAt: -1 }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ]);

        const patientVitalsCount = await PatientVitals.aggregate([
          {
            $match: {
              status: { $ne: 2 },
            }
          },
          {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patientDetails',
            }
          },
          {
            $unwind: '$patientDetails',
          },
          {
            $match: {
              $or: [
                { 'patientDetails.firstName': { $regex: new RegExp(word, 'i') } },
                { 'patientDetails.email': { $regex: new RegExp(word, 'i') } },
                { 'patientDetails.phone': { $regex: new RegExp(word, 'i') } },
              ]
            }
          },
          {
            $count: 'total'
          }
        ]);


        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_PATIENT_VITALS_LIST,
          data: { patientVitalsList, patientVitalsCount }
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  getPatientVitalsbyId(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const patientVitalId = req.params.id;
        // Validate adminId
        if (!patientVitalId) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ID_NOT_CORRECT,
          });
        }
        // Check if adminId is a valid ObjectId
        if (!patientVitalId || !mongoose.Types.ObjectId.isValid(patientVitalId)) {
          reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ID_NOT_CORRECT,
          });
          return;
        }
        const patientvital = await PatientVitals.findOne({
          _id: patientVitalId,
          status: { $ne: 2 }
        });

        if (!patientvital) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.PATIENT_VITALS_NOT_FOUND,
          });
        }
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_PATIENT_VITAL_RETRIEVAL,
          data: patientvital,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  updatePatientVitals(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const patientVitalId = req.params.id;
        const patientVitals = await PatientVitals.findOne({ _id: patientVitalId });
        if (!patientVitals) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.PATIENT_VITALS_NOT_FOUND,
          });
        }
        let patientVitalsData = req.body;

        await PatientVitals.updateOne(
          { _id: patientVitalId },
          { $set: patientVitalsData },
          { new: true, upsert: true }
        );
        const updatePatientVitals = await PatientVitals.findOne({ _id: patientVitalId });

        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_PATIENT_VITALS_UPDATE,
          data: updatePatientVitals,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  deletePatientVitals(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const patientVitalId = req.params.id;
        const patientVitals = await PatientVitals.findOne({ _id: patientVitalId });
        if (!patientVitals) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.PATIENT_VITALS_NOT_FOUND,
          });
        }

        await PatientVitals.updateOne({ _id: patientVitalId }, { status: 2 }, { new: true });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_PATIENT_VITALS_DELETED,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  adminPatientPrescriptionRegister(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        var patientPrescriptionData = req.body;
        try {
          let patientPrescriptionInstance = new PatientPrescription(patientPrescriptionData);
          const result = await patientPrescriptionInstance.save();
          const data = JSON.parse(JSON.stringify(result));

          resolve({
            code: CONFIG.SUCCESS_CODE,
            message: CONFIG.SUCCESS_PATIENT_PRESCRIPTION_CREATION,
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

  getAllPatientPrescriptionList(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        const word = req.query.search;
        const patientId = req.query.patientId;
        const patientPrescriptionList = await PatientPrescription.aggregate([
          {
            $match: {
              status: { $ne: 2 },
              patientId: patientId
            }
          },
          {
            $lookup: {
              from: 'patients', // Assuming your patient collection is named 'patients'
              localField: 'patientId',
              foreignField: '_id',
              as: 'patientDetails',
            }
          },
          {
            $unwind: '$patientDetails',
          },
          {
            $match: {
              $or: [
                { 'patientDetails.firstName': { $regex: new RegExp(word, 'i') } },
                { 'patientDetails.email': { $regex: new RegExp(word, 'i') } },
                { 'patientDetails.phone': { $regex: new RegExp(word, 'i') } },
              ]
            }
          },
          {
            $sort: { createdAt: -1 }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ]);

        const patientPrescriptionCount = await PatientPrescription.aggregate([
          {
            $match: {
              status: { $ne: 2 },
              patientId: patientId
            }
          },
          {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patientDetails',
            }
          },
          {
            $unwind: '$patientDetails',
          },
          {
            $match: {
              $or: [
                { 'patientDetails.firstName': { $regex: new RegExp(word, 'i') } },
                { 'patientDetails.email': { $regex: new RegExp(word, 'i') } },
                { 'patientDetails.phone': { $regex: new RegExp(word, 'i') } },
              ]
            }
          },
          {
            $count: 'total'
          }
        ]);


        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_PATIENT_PRESCRIPTION_LIST,
          data: { patientPrescriptionList, patientPrescriptionCount }
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  getPatientPrescriptionbyId(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const patientPrescriptionId = req.params.id;
        // Validate adminId
        if (!patientPrescriptionId) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ID_NOT_CORRECT,
          });
        }
        // Check if adminId is a valid ObjectId
        if (!patientPrescriptionId || !mongoose.Types.ObjectId.isValid(patientPrescriptionId)) {
          reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ID_NOT_CORRECT,
          });
          return;
        }
        const patientPrescription = await PatientPrescription.findOne({
          _id: patientPrescriptionId,
          status: { $ne: 2 }
        });

        if (!patientPrescription) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.PATIENT_PRESCRIPTION_NOT_FOUND,
          });
        }
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_PATIENT_PRESCRIPTION_RETRIEVAL,
          data: patientPrescription,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  updatePatientPrescription(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const patientPrescriptionId = req.params.id;
        const patientPrescription = await PatientPrescription.findOne({ _id: patientPrescriptionId });
        if (!patientPrescription) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.PATIENT_PRESCRIPTION_NOT_FOUND,
          });
        }
        let patientPrescriptionData = req.body;

        await PatientPrescription.updateOne(
          { _id: patientPrescriptionId },
          { $set: patientPrescriptionData },
          { new: true, upsert: true }
        );
        const updatePatientPrescription = await PatientPrescription.findOne({ _id: patientPrescriptionId });

        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_PATIENT_PRESCRIPTION_UPDATE,
          data: updatePatientPrescription,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  deletePrescriptionVitals(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const patientPrescriptionId = req.params.id;
        const patientVitals = await PatientPrescription.findOne({ _id: patientPrescriptionId });
        if (!patientVitals) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.PATIENT_PRESCRIPTION_NOT_FOUND,
          });
        }
        await PatientPrescription.updateOne({ _id: patientPrescriptionId }, { status: 2 }, { new: true });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_CODE_PATIENT_PRESCRIPTION_DELETED,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  sendEmailForgotPasswordforAdmin(req, res) {
    return new Promise(async function (resolve, reject) {
      try {

        const otp = '12345';
        const checkAdmin = await Admin.findOneAndUpdate(
          { email: req.body.email, status: { $ne: 2 } },
          { otp: otp },
          { new: true }
        );

        if (!checkAdmin) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.EMAIL_NOT_CORRECT,
          });
        }

        // let transporter = nodemailer.createTransport({
        //   host: process.env.HOST,
        //   port: 465,
        //   auth: {
        //     user: process.env.USERNAME,
        //     pass: process.env.PASS,
        //   },
        // });

        // let htmlContent = `
        //   <div style="text-align: center; font-family: Arial, sans-serif;">
        //     <img src=" ${process.env.BASEURL}/static/image1-1716183643198-334295482.jpg" alt="Company Logo" width="200px" height="auto" style="margin-bottom: 20px;">
        //     <h2>Forgot Password</h2>
        //     <p>Dear User,</p>
        //     <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to reset your password:</p>
        //     <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
        //     <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
        //     <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
        //     <p style="font-style: italic;">Thank you for using our service!</p>
        //   </div>
        // `;

        // let mailOptions = {
        //   from: process.env.MAILFROM,
        //   to: email,
        //   subject: "Forgot Password",
        //   html: htmlContent,
        // };

        // Send email
        // transporter.sendMail(mailOptions, (error, info) => {
        //   if (error) {
        //     console.log("Error occurred while sending email:", error.message);
        //     return reject({
        //       code: CONFIG.ERROR_CODE,
        //       message: error.message,
        //     });
        //   } else {
        //     console.log("Email sent successfully!");
        //     resolve({
        //       code: CONFIG.SUCCESS_CODE,
        //       message: CONFIG.OTP_SUCCESS,
        //     });
        //   }
        // });
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.OTP_SUCCESS,
        });

      } catch (error) {
        return reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  verifyEmailOtpforAdmin(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const { email, otp } = req.body;

        const check = await Admin.findOne({
          email: email,
          status: { $ne: 2 },
        });

        if (check) {
          if (otp == check.otp) {
            const cleanOtp = await Admin.findOneAndUpdate(
              { email: email, status: { $ne: 2 } },
              { otp: '' },
              { new: true }
            ).select('_id');
            if (cleanOtp) {
              resolve({
                code: CONFIG.SUCCESS_CODE,
                message: CONFIG.OTPVERIFY,
                data: cleanOtp
              });
            }
          } else {
            resolve({
              code: CONFIG.ERROR_CODE_BAD_REQUEST,
              message: CONFIG.OTPNOTVERIFY,
            });
          }
        } else {
          resolve({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_EMAIL,
          });
        }
      } catch (error) {
        return reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  updatePasswordforAdminEmail(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const adminId = req.params.id;
        const newPassword = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const adminData = await Admin.findOneAndUpdate(
          { _id: adminId },
          { password: hashedPassword },
          { new: true }
        );

        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_ADMIN_PASSWORD_UPDATED,
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
