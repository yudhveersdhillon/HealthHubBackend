require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");

require("./connection/connect");
const CONFIG = require("./config/appConfig");
const response = require("./responses");
const v1 = require("./v1/routes");
var assetlinks = require("../assetlinks.json");
var appleappassociation = require("../apple-app-site-association.json");

var app = express();

let server = http
  .createServer(app, function (req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end();
  })
  .listen(CONFIG.PORT || 3020, (err) => {
    if (err) {
      return console.log("something bad happened", err);
    }
    console.log("server is running on port: " + CONFIG.PORT);
  });

app.use(function (req, res, next) {
  console.log(req.method + " " + req.originalUrl);
  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "HEAD, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization, authorization,appstats"
  );
  next();
});

app.use(response.success, response.reject);
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: false }));

// Api routes here
app.use("/api/v1/", v1);
app.use(
  "/static",
  express.static(path.join(__dirname, "../server/public/uploads"))
);



app.get("/", (req, res) => {


  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Continue to AgeProof App</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 20px;
              text-align: center;
          }
          .container {
              background-color: #fff;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              width: 100%;
          }
          .logo {
              max-width: 200px;
              margin-bottom: 20px;
          }
          h1 {
              font-size: 24px;
              margin-bottom: 20px;
              color: #333;
          }
          p {
              font-size: 18px;
              margin-bottom: 30px;
              color: #666;
          }
          .open-app-button {
              background-color: #007bff;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-size: 18px;
          }
          .open-app-button:hover {
              background-color: #0056b3;
          }
      </style>
  </head>
  <body>
      <div class="container">
     
          <img src="${process.env.BASEURL}/static/logo.png" alt="AgeProof Logo" class="logo">
          <h1>Please Close This Window and Go Back to the App</h1>
          <p>Thank you for logging in. To continue, please click the button below to open the AgeProof App.</p>
          <a class="open-app-button" href="ageproof://open" target="_blank">Open AgeProof App</a>
      </div>
  </body>
  </html>
`;
  res.status(200).send(htmlContent);
});



app.get("/downloads", (req, res) => {


  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Download AgeProof App</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 20px;
              text-align: center;
          }
          .container {
              background-color: #fff;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              width: 100%;
          }
          .logo {
              max-width: 200px;
              margin-bottom: 20px;
          }
          h1 {
              font-size: 24px;
              margin-bottom: 20px;
              color: #333;
          }
          p {
              font-size: 18px;
              margin-bottom: 30px;
              color: #666;
          }
          .open-app-button {
              background-color: #007bff;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-size: 18px;
          }
          .open-app-button:hover {
              background-color: #0056b3;
          }
      </style>
  </head>
  <body>
      <div class="container">
     
          <img src="${process.env.BASEURL}/static/logo.png" alt="AgeProof Logo" class="logo">
          <h1>Direct Download of App</h1>
          <p>Please download the app using this link to download for Apple iOS: </p>
          <a class="open-app-button" href="itms-services://?action=download-manifest&url=https://api.ageproof.app/download/ios/manifest.plist">Download for iOS</a>
      </div>
  </body>
  </html>
`;
  res.status(200).send(htmlContent);
});

//
/**
 * Create Global socket io for use.
 */
global.io = require("socket.io")(server);
require("./v1/routes/socket")(io);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("404 " + req.method + " " + req.originalUrl);

  res.status(404).send("api not found");
});

// error handler
app.use(function (err, req, res, next) {
  console.log("500 " + req.method + " " + req.originalUrl);
  res.status(500).send("Something broke!");
});
