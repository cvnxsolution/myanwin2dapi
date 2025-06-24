const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/.env` });

const app = require("./app");
const mongoose = require("mongoose");

const Database = process.env.Database;
const LocalDb = process.env.LocalDB;

const environment = process.env.NODE_ENV;

if (environment === "development") {
  mongoose.connect(LocalDb).then(() => {
    console.log("local db connected");
  });
} else {
  mongoose.connect(Database).then(() => {
    console.log("mongodb atlas connected");
  });
}

app.listen(8000, (error) => {
  console.log("server is listening on port 8000");
});
