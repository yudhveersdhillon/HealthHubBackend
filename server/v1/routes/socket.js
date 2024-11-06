var express = require("express");
var jwt = require("jsonwebtoken");
var router = express();
var User = require("../../models/user");

const CONFIG = require("../../config/appConfig");

let users = [];

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
