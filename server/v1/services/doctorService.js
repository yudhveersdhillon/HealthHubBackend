require("dotenv").config();
const CONFIG = require("../../config/appConfig");
const Util = require("../../utils/commonUtils");
const jwtUtil = require("../../utils/JwtUtils");
const Manager = require("../../models/doctor");
const Admin = require("../../models/admin");
const Patient = require("../../models/patient");
const Appointment = require("../../models/appointment");
const Doctor = require("../../models/doctor");
const User = require("../../models/staff");
const ObjectId = require("mongoose").Types.ObjectId;
const qrCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const moment = require("moment");
const appointment = require("../../models/appointment");

class doctorService {
  Doctorlogin(req, res) {
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
      Doctor.findOne({
        email: body.email.toLowerCase(),
        status: CONFIG.ACTIVE_STATUS,
      })
        .select("+password")
        .then(async (user) => {
          if (!user) {
            return reject({
              code: CONFIG.ERROR_CODE,
              message: CONFIG.DOCTOR_NOT_FOUND,
            });
          }
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
            name: data.name
          });
          data.token = token;
          return resolve({
            code: CONFIG.SUCCESS_CODE,
            message: CONFIG.DOCTOR_SUCCESSFUL_LOGIN,
            data: data,
          });
        })
        .catch((err) => {
          return reject({ code: CONFIG.ERROR_CODE, message: err.message });
        });
    });
  }

  DoctorAppointmentList(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const { page = 1, limit = 10 } = req.query;  // Pagination (default page = 1, limit = 10)
        const doctorId = req.user._id;  // Assuming req.user._id contains the logged-in doctor's ID

        const aggregatePipeline = [
          {
            $match: {
              doctorId: doctorId,  // Match appointments for the specific doctor
            },
          },
          {
            $lookup: {
              from: "patients",  // Lookup from the 'Patient' collection
              localField: "patientId",  // Field in the Appointment model to join with
              foreignField: "_id",  // Field in the Patient model to join with
              as: "patientDetails",  // Alias for the array of patient details
            },
          },
          {
            $unwind: {
              path: "$patientDetails",  // Unwind the patientDetails array to get the patient details
              preserveNullAndEmptyArrays: true,  // To include appointments with no patientDetails
            },
          },
          {
            $skip: (page - 1) * limit,  // Skip for pagination
          },
          {
            $limit: parseInt(limit),  // Limit the number of results per page
          },
          {
            $project: {
              "patientDetails.firstName": 1,
              "patientDetails.lastName": 1,
              "patientDetails.email": 1,
              "patientDetails.phone": 1,
              "appointmentDate": 1,
              "status": 1,
              _id: 1,
            },
          },
          {
            $facet: {
              totalCount: [{ $count: "total" }],  // Count total documents for pagination
              data: [{ $skip: (page - 1) * limit }, { $limit: parseInt(limit) }],
            },
          },
        ];

        const appointmentData = await Appointment.aggregate(aggregatePipeline);

        // Extract total count and data from the facet
        const totalCount = appointmentData[0]?.totalCount[0]?.total || 0;
        const appointments = appointmentData[0]?.data || [];

        return resolve({
          code: CONFIG.SUCCESS_CODE,
          message: "Appointments fetched successfully",
          data: appointments,
          totalCount: totalCount
        });
      } catch (err) {
        return reject({
          code: CONFIG.ERROR_CODE,
          message: err.message,
        });
      }
    });
  }

  DoctorPerPatientData(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const patientId = req.params.id;
        const patientData = await Patient.findOne({ _id: patientId });
        if (!patientData) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: "Patient not found",
          });
        }
        return resolve({
          code: CONFIG.SUCCESS_CODE,
          message: "Patient fetched successfully",
          data: patientData
        });
      } catch (err) {
        return reject({
          code: CONFIG.ERROR_CODE,
          message: err.message,
        });
      }
    });
  }


  registerManager(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        console.log(req.body, "bodyyyyy");
        const adminEmail = req.body.email.toLowerCase();
        const storeName = req.body.storeName;
        const checkAdminEmail = await Admin.findOne({ email: adminEmail, status: { $ne: 2 } });
        if (checkAdminEmail) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERROR_CODE_SAME_EMAIL,
          });
        }
        const checkstoreName = await Store.findOne({
          storeName: {
            $regex: new RegExp(storeName, "i"),
          },
          status: { $ne: 2 },
        });
        if (checkstoreName) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERROR_CODE_SAME_STORE,
          });
        }

        var StoreData = {
          storeName: req.body.storeName,
          address: req.body.address,
          location: {
            type: req.body.locationType,
          },
          status: req.body.status,
        };

        let newCoordinates = req.body.coordinates.split(",").map(parseFloat);
        StoreData.location.coordinates = newCoordinates;

        var adminData = {
          name: req.body.name,
          email: req.body.email.toLowerCase(),
          password: req.body.password,
          phone: req.body.phone,
          status: req.body.status,
          storeId: req.body.storeId,
          role: req.body.role,
        }

        // Assuming 'image' and 'bannerImage' are the field names for the images
        if (req.files) {
          const imageUrl = req.files["image"]
            ? `static/store/image/${req.files["image"][0].filename}`
            : null;
          const logoImageUrl = req.files["logo"]
            ? `static/store/logo/${req.files["logo"][0].filename}`
            : null;
          const profileImage = req.files["profileImage"]
            ? `static/profileImage/${req.files["profileImage"][0].filename}`
            : null;
          StoreData.imageUrl = imageUrl;
          StoreData.logoImageUrl = logoImageUrl;
          adminData.profileImage = profileImage;

        }

        const newmanager = new Admin(adminData);
        newmanager.password = await newmanager.setPassword(adminData.password);
        var manager = await newmanager.save();
        // If not found, save the new store
        const newstore = new Store(StoreData);
        newstore
          .save()
          .then(async (store) => {
            const updateAdmin = await Admin.findOneAndUpdate({ _id: manager._id }, { storeId: store._id }, { new: true });
            var ageData = req.body.ageData ? req.body.ageData : [];
            if (ageData && ageData.length) {
              let item = [];
              ageData.map(a => {
                item.push({
                  color: a.color,
                  storeId: store._id,
                  upperLimit: a.upperLimit,
                  lowerLimit: a.lowerLimit,
                })
              });
              await AgeLimit.insertMany(item);

            }

            await Admin.findOneAndUpdate({ _id: manager._id }, { storeId: store._id }, { new: true });
            // Generate QR code
            const qrCodeData = String(store._id);
            const qrCodePath = path.join(
              __dirname,
              "../../",
              "public",
              "uploads",
              "store",
              "qrCodes",
              `${store._id}.png`
            );
            qrCode.toFile(qrCodePath, qrCodeData, (err) => {
              if (err) {
                return reject({
                  code: CONFIG.ERROR_CODE,
                  message: CONFIG.QR_GENERATE_FAILED,
                });
              }
              resolve({
                code: CONFIG.SUCCESS_CODE,
                message: CONFIG.SUCCESS_CODE_STORE_ADDED,
                data: store,
              });
            });
          })
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  sendEmailForgotPasswordforDoctor(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const email = req.body.email;
        const otp = Math.floor(1000 + Math.random() * 9000);
        const checkDoctor = await Doctor.findOneAndUpdate(
          { email: req.body.email, status: { $ne: 2 } },
          { otp: otp },
          { new: true }
        );
        if (!checkDoctor) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.EMAIL_NOT_CORRECT,
          });
        }

        let transporter = nodemailer.createTransport({
          host: process.env.HOST,
          port: 465,
          auth: {
            user: process.env.USERNAME,
            pass: process.env.PASS,
          },
        });

        let htmlContent = `
          <div style="text-align: center; font-family: Arial, sans-serif;">
            <img src=" ${process.env.BASEURL}/static/image1-1716183643198-334295482.jpg" alt="Company Logo" width="200px" height="auto" style="margin-bottom: 20px;">
            <h2>Forgot Password</h2>
            <p>Dear User,</p>
            <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to reset your password:</p>
            <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
            <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
            <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
            <p style="font-style: italic;">Thank you for using our service!</p>
          </div>
        `;

        let mailOptions = {
          from: process.env.MAILFROM,
          to: email,
          subject: "Forgot Password",
          html: htmlContent,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error occurred while sending email:", error.message);
            return reject({
              code: CONFIG.ERROR_CODE,
              message: error.message,
            });
          } else {
            console.log("Email sent successfully!");
            resolve({
              code: CONFIG.SUCCESS_CODE,
              message: CONFIG.OTP_SUCCESS,
            });
          }
        });

      } catch (error) {
        return reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }

  verifyEmailOtpforDoctor(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const { email, otp } = req.body;

        const check = await Doctor.findOne({
          email: email,
          status: { $ne: 2 },
        });

        if (check) {
          if (otp == check.otp) {
            const cleanOtp = await Doctor.findOneAndUpdate(
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


  updatePasswordforDoctorEmail(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const doctorId = req.params.id;
        const newPassword = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const doctorData = await Admin.findOneAndUpdate(
          { _id: doctorId },
          { password: hashedPassword },
          { new: true }
        );

        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_DOCTOR_PASSWORD_UPDATED,
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

module.exports = doctorService;
