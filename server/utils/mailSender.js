const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    // Validate required environment variables
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error(
        "Missing email configuration: MAIL_USER and MAIL_PASS environment variables must be set."
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.MAIL_PORT || 465),
      secure: (process.env.MAIL_SECURE || "true") === "true",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    const info = await transporter.sendMail({
      from: `"Lead Management" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail sent successfully to:", email);
    return info;
  } catch (error) {
    console.log(`Mail Error (to: ${email}, subject: "${title}"):`, error.message || error);
    throw error;
  }
};

module.exports = mailSender;
