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


}

module.exports = userService;
