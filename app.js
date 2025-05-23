const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const globalErrorHandler = require("./controllers/errorController");
const authRoute = require("./routes/authRoute");
const agentRoute = require("./routes/agentRoute");
const userRoute = require("./routes/userRoute");
const { isAuthenticated } = require("./middlewares/isAuthenticated");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(cors());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/agent", isAuthenticated, agentRoute);

app.use(globalErrorHandler);

module.exports = app;
