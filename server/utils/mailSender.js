const nodemailer = require("nodemailer");
const dns = require("dns").promises;

const mailSender = async (email, title, body) => {
  try {
    if (process.env.BREVO_API_KEY) {
      const fromEmail = process.env.MAIL_FROM_EMAIL || process.env.MAIL_USER;
      const fromName = process.env.MAIL_FROM_NAME || "Lead Management";

      if (!fromEmail) {
        throw new Error("Missing email configuration: MAIL_FROM_EMAIL or MAIL_USER must be set.");
      }

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: fromName,
            email: fromEmail,
          },
          to: [{ email }],
          subject: title,
          htmlContent: body,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || `Brevo API failed with status ${response.status}`);
      }

      console.log("Mail sent successfully to:", email);
      return result;
    }

    // Validate required environment variables
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error(
        "Missing email configuration: MAIL_USER and MAIL_PASS environment variables must be set."
      );
    }

    const mailHost = process.env.MAIL_HOST || "smtp.gmail.com";
    let smtpHost = mailHost;

    try {
      const [ipv4Address] = await dns.resolve4(mailHost);
      if (ipv4Address) {
        smtpHost = ipv4Address;
      }
    } catch (error) {
      console.log(`IPv4 SMTP lookup failed for ${mailHost}:`, error.message || error);
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.MAIL_PORT || 465),
      secure: (process.env.MAIL_SECURE || "true") === "true",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        servername: mailHost,
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
