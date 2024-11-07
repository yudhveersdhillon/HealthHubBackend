require("dotenv").config();
const jwtUtil = require("../../utils/JwtUtils");
const CONFIG = require("../../config/appConfig");
const Util = require("../../utils/commonUtils");
const mongoose = require("mongoose");
const path = require("path");
const Staff = require("../../models/staff");
const Manager = require("../../models/doctor");
const Admin = require("../../models/admin");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const ObjectId = require("mongoose").Types.ObjectId;

class userService {
  // User Sign Up
  userSignUp(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        let body = req.body;
        if (body.email && !Util.isValidEmail(body.email))
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_EMAIL,
          });
        else if (body.password && !Util.isValidPassword(body.password))
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.ERR_INVALID_PASSWORD,
          });
        const existingUser = await User.findOne({
          email: body.email.toLowerCase(),
          status: { $ne: 2 },
        });
        if (existingUser) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.EMAIL_ALREADY_EXISTS,
          });
        }
        let newUser = new User(body);
        newUser.signupType = "emailType";
        newUser.password = await newUser.setPassword(body.password);

        newUser
          .save()
          .then(async (result) => {
            // let validateUser = new ValidateUser({
            //   userId: result._id,
            //   uuid: result.uuid,
            //   deviceId: result.deviceId,
            // });
            // await validateUser.save();
            // const token = jwt.sign(result.toObject(), CONFIG.JWT_ENCRYPTION);
            //result.token = token;
            var data = JSON.parse(JSON.stringify(result));
            delete data.password;
            resolve({
              code: CONFIG.SUCCESS_CODE,
              message: CONFIG.USER_CREATION,
              data: data,
            });
          })
          .catch((error) => {
            reject({
              code: CONFIG.ERROR_CODE,
              message: error.message,
            });
          });
      } catch (error) {
        return reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  Stafflogin(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
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
        Staff.findOne({
          email: body.email.toLowerCase(),
          status: { $ne: 2 },
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
              name: data.name
            });
            data.token = token;
            resolve({
              code: CONFIG.SUCCESS_CODE,
              message: CONFIG.STAFF_SUCCESSFUL_LOGIN,
              data: data,
            });
          })
          .catch((error) => {
            reject({
              code: CONFIG.ERROR_CODE,
              message: error.message,
            });
          });
      } catch (error) {
        return reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }
  updateUserDeatails(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        var body = req.body;
        const uuid = body?.uuid;
        const checkuuid = await User.findOne({
          uuid: uuid,
          status: { $ne: 2 },
        });
        if (checkuuid) {
          return reject({
            code: CONFIG.ERROR_CODE,
            message: CONFIG.SAME_UUID_EXISTS,
          });
        }
        const updateDetails = await User.findOneAndUpdate(
          {
            email: body.email.toLowerCase(),
            status: CONFIG.ACTIVE_STATUS,
          },
          { $set: body },
          { new: true }
        );
        // let validateUser = new ValidateUser({
        //   userId: updateDetails._id,
        //   uuid: updateDetails.uuid,
        //   deviceId: updateDetails.deviceId,
        // });
        // await validateUser.save();
        var data = JSON.parse(JSON.stringify(updateDetails));

        let token = jwtUtil.issue({
          data,
        });
        // console.log();
        data.token = token;
        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.USER_SUCCESSFUL_UPDATE,
          data: data,
        });
      } catch (error) {
        reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }


  userLogout(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        let email = req.body.email;
        let deviceId = req.body.deviceId;
        const existingUser = await User.findOneAndUpdate(
          { email: email, deviceId: deviceId, status: 1 },
          { logoutStatus: 0 },
          { new: true }
        );
        if (!existingUser) {
          resolve({
            code: CONFIG.SUCCESS_CODE,
            message: CONFIG.LOGOUT_USER,
          });
        }

        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.USER_LOGGED_OUT_SUCCESSFULLY,
        });
      } catch (error) {
        return reject({
          code: CONFIG.ERROR_CODE,
          message: error.message,
        });
      }
    });
  }
  sendEmailForgotPasswordforStaff(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const email = req.body.email;
        const otp = Math.floor(1000 + Math.random() * 9000);
        const checkStaff = await Staff.findOneAndUpdate(
          { email: req.body.email, status: { $ne: 2 } },
          { otp: otp },
          { new: true }
        );
        if (!checkStaff) {
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

  verifyEmailOtpforStaff(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const { email, otp } = req.body;

        const check = await Staff.findOne({
          email: email,
          status: { $ne: 2 },
        });

        if (check) {
          if (otp == check.otp) {
            const cleanOtp = await Staff.findOneAndUpdate(
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


  updatePasswordforStaffEmail(req, res) {
    return new Promise(async function (resolve, reject) {
      try {
        const staffId = req.params.id;
        const newPassword = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const staffData = await Staff.findOneAndUpdate(
          { _id: staffId },
          { password: hashedPassword },
          { new: true }
        );

        resolve({
          code: CONFIG.SUCCESS_CODE,
          message: CONFIG.SUCCESS_STAFF_PASSWORD_UPDATED,
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

module.exports = userService;
