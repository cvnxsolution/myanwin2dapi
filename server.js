const dotenv = require("dotenv");

dotenv.config({ path: `${__dirname}/.env` });

const app = require("./app");
const mongoose = require("mongoose");

const Database = process.env.Database;

mongoose.connect(Database).then(() => {
  console.log("db connected");
});

app.listen(8000, (error) => {
  console.log("server is listening on port 8000");
});
