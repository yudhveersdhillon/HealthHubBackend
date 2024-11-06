const mongoose = require("mongoose");
const { host, port, dbName } = require("../config/dbConfig");
mongoose.Promise = global.Promise;

var url = `mongodb://${host}:${port}/${dbName}`;

mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("mongoose Error ", err);
  });

module.exports = mongoose;
