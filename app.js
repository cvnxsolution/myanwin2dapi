const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const globalErrorHandler = require("./controllers/errorController");
const authRoute = require("./routes/authRoute");
const CustomAppError = require("./utils/CustomAppError");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(cors());
app.use("/api/v1/auth", authRoute);

app.use(globalErrorHandler);

module.exports = app;
