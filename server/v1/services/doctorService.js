require("dotenv").config();
const CONFIG = require("../../config/appConfig");
const Util = require("../../utils/commonUtils");
const jwtUtil = require("../../utils/JwtUtils");
const Manager = require("../../models/doctor");
const Admin = require("../../models/admin");
const User = require("../../models/staff");
const ObjectId = require("mongoose").Types.ObjectId;
const qrCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const moment = require("moment");

class managerService {
  loginManager(req, res) {
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
          if (user && user.role == 'admin') {
            return reject({
              code: CONFIG.ERROR_CODE_FORBIDDEN,
              message: CONFIG.EMAIL_NOT_CORRECT,
            });
          }
          if (!user || (user && user.role != "manager"))
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
            data: data,
          });
        })
        .catch((err) => {
          return reject({ code: CONFIG.ERROR_CODE, message: err.message });
        });
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




}

module.exports = managerService;
