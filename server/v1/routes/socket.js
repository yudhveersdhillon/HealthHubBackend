var express = require("express");
var jwt = require("jsonwebtoken");
var router = express();
var User = require("../../models/user");
var UserVisit = require("../../models/userVisit");

const CONFIG = require("../../config/appConfig");

let users = [];
let mitid_login_data = [];

module.exports = (io) => {
  io.use(function (socket, next) {
    // console.log(socket.handshake, "Token ---------");

    if (
      (socket.handshake.headers && socket.handshake.headers.token) ||
      (socket.handshake.query && socket.handshake.query.token)
    ) {
      // const parts = socket.handshake.headers.token.split(" ");
      //verify jwt token
      // jwt.verify(parts[1], CONFIG.JWT_ENCRYPTION, function (err, user) {
      //     if (err) return next(new Error('Authentication error'));
      //     let userId = user._id

      //     // Find saved id in database
      //     User.findOne({ _id: userId }).then(user => {
      //         if (user) {
      //             next();
      //         } else {
      //             return next(new Error('Authentication error'));
      //         }
      //     })
      // });
      next();
    } else {
      next(new Error("Authentication error"));
    }
  }).on("connection", (socket) => {
    socket.on("newconnection", () => {
      console.log("newconnection");
    });
    socket.on("deviceId", (data) => {
      console.log("deviceId:", data);

      if (global.mitid_login_data[data]) {
        console.log("emiting again pass connection ittend:","mitid_login" + data, global.mitid_login_data[data]);
        io.emit("mitid_login" + data, global.mitid_login_data[data]);
        delete global.mitid_login_data[data];
      }
    });
    socket.on("qrscanned", async (data) => {
      console.log(data,"data for socket");
      if (data.storeId) {
        let userVisit = new UserVisit({
          storeId: data.storeId,
          userId: data.id,
          loginType: data.loginType,
        });
        let result = await userVisit.save();
        // console.log("qrscanned_" + data.managerId);
        const dataUser = await UserVisit
          .findOne({ _id: result._id })
          .populate("userId");
          const response = {
            ...dataUser.toObject(), // Convert Mongoose document to plain object
            userData: dataUser.userId, // Add populated user data as userData
            userId: dataUser.userId._id
          };
        io.emit("qrscanned_" + data.storeId, {
          success: true,
          data: response,
        });
      } else
        io.emit("qrscanned_" + data.storeId, { success: true, data: data });
    });

    socket.on("end", function () {
      socket.disconnect();
    });

    socket.on("disconnect", function () {
      users = users.filter(function (obj) {
        return obj.socketId != socket.id;
      });
    });
  });
  return router;
};
