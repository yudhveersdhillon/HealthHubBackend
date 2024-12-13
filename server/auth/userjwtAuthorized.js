const User = require("../models/staff");
const CONFIG = require("../config/appConfig");
const jwtUtil = require("../utils/JwtUtils");

module.exports = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length !== 2)
      return res.reject(CONFIG.ERROR_CODE_UNAUTHORIZED, CONFIG.TOKENNOTCORRECT);

    const token = parts[1];
    const scheme = parts[0];
    jwtUtil.verify(token, (error, user) => {
      if (error)
        return res.reject(
          CONFIG.ERROR_CODE_UNAUTHORIZED,
          CONFIG.TOKENNOTCORRECT
        );
      // console.log('user', user)
      //, uuid : user.uuid , deviceId : user.deviceId
      if (user.updateDetails) {
        User.findOne({ _id: user.updateDetails._id }).then((user1) => {
          if (user1 && user?.updateDetails?.deviceId != user1?.deviceId) {
            return res.reject(
              CONFIG.ERROR_CODE_UNAUTHORIZED,
              CONFIG.USERNOTSAMEDEVICE
            );
          }
          if (user.updateDetails.status != CONFIG.ACTIVE_STATUS)
            return res.reject(
              CONFIG.ERROR_CODE_UNAUTHORIZED,
              CONFIG.DISABLED_AUTHORIZATION
            );

          req.user = user;
          next();
        });
      } else if (user.data) {
        User.findOne({ _id: user.data._id }).then((user1) => {
          if (user1 && user?.data?.deviceId != user1?.deviceId) {
            return res.reject(
              CONFIG.ERROR_CODE_UNAUTHORIZED,
              CONFIG.USERNOTSAMEDEVICE
            );
          }
          if (user.data.status != CONFIG.ACTIVE_STATUS)
            return res.reject(
              CONFIG.ERROR_CODE_UNAUTHORIZED,
              CONFIG.DISABLED_AUTHORIZATION
            );

          req.user = user;
          next();
        });
      } else {

        User.findOne({ _id: user._id }).then((user1) => {
          if (user1 && user?.deviceId != user1?.deviceId) {
            return res.reject(
              CONFIG.ERROR_CODE_UNAUTHORIZED,
              CONFIG.USERNOTSAMEDEVICE
            );
          }
          if (user.status != CONFIG.ACTIVE_STATUS)
            return res.reject(
              CONFIG.ERROR_CODE_UNAUTHORIZED,
              CONFIG.DISABLED_AUTHORIZATION
            );

          req.user = user;
          next();
        });
      }
    });
  } else {
    return res.reject(CONFIG.ERROR_CODE_UNAUTHORIZED, CONFIG.TOKEN_MISSING);
  }
};
