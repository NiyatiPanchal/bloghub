const sendEmail = require("./sendemail");

const sendOtp = async (email) => {
  const subject = "Verify OTP";
  var digits = "0123456789";
  let otp = "";
  for (let i = 1; i <= 4; i++) {
    var index = Math.floor(Math.random() * digits.length);

    otp = otp + digits[index];
  }
  const text = "Verify with OTP" + ":" + `${otp}`;
  await sendEmail(email, subject, text);
  return otp;
};

module.exports = sendOtp;
