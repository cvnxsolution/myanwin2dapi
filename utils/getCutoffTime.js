const cutoffConfig = require("../config/cutoffConfig");
const CustomAppError = require("./CustomAppError");

exports.getCutoffTime = (next) => {
  const timeNow = new Date().getHours();
  let time;
  if (timeNow < 12) {
    time = "afternoon";
    return cutoffConfig[time];
  } else if (time > 12 && time <= 16) {
    time = "evening";
    return cutoffConfig[time];
  } else {
    throw new CustomAppError(
      "Market is closed for now, will be open at tommorrow 6:00 AM",
      400
    );
  }
};
