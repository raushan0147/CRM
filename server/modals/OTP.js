const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templetes/emailVerificatonTemplete");

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 5 },
});

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    );
    console.log("Email sent successfully:", mailResponse.response);
  } catch (error) {
    console.log("Error occurred while sending email:", error.message || error);
  }
}

OTPSchema.pre("save", async function () {
  console.log("New document saved to database");
  try {
    if (this.isNew) {
      await sendVerificationEmail(this.email, this.otp);
    }
  } catch (error) {
    console.log("Unexpected error in OTP pre-save hook:", error.message || error);
  }
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;