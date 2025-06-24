const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const globalErrorHandler = require("./controllers/errorController");

// import routes
const authRoute = require("./routes/authRoute");
const agentRoute = require("./routes/agentRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const betRoute = require("./routes/betRoute");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(cors());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/agent", agentRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/bet", betRoute);


app.all('/', (req, res, next) => {
    res.status(404).json({
        message: "This is not public api, cannot be used outside of the app, myanwin2d",
        instruction: "you can download the app from, https://github.com/cvnxsolution/myanwin2d repository"
    })
})

app.use(globalErrorHandler);

module.exports = app;
