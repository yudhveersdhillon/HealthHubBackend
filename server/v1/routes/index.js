require("dotenv").config();
var express = require("express");
var route = express.Router();

route.get("/", function (req, res) {
  res.status(200).send("Welcome to AgeProof v1 APIs...");
});

route.get("/callback", function (req, res) {
  console.log("Get - req.query:", req.query);

  //save the req.query and req.query.state to a global variable
  global.mitid_login_data[req.query.state] = req.query;
  console.log("io emitting mitid_login" + req.query.state, req.query);
  global.io.emit("mitid_login" + req.query.state, req.query);
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

route.post("/callback", function (req, res) {
  console.log("Post", req.body);
  res.status(200).send("please close this window and go back to app");
});

route.use("/admin", require("./adminRoutes"));
route.use("/manager", require("./doctorRoutes"));
route.use("/user", require("./staffRoutes"));

module.exports = route;
