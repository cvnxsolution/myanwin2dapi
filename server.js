const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/.env` });

const app = require("./app");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/myanwin2d").then(() => {
  console.log("db connected");
});

app.listen(8000, (error) => {
  console.log("server is listening on port 8000");
});
