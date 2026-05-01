const otpTemplate = (otp) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <div style="max-width:500px; margin:auto; background:white; padding:20px; border-radius:10px;">
      
      <h2 style="text-align:center; color:#333;">🔐 Email Verification</h2>
      
      <p>Hello,</p>
      <p>Use the OTP below to verify your account:</p>
      
      <div style="text-align:center; margin:20px 0;">
        <span style="font-size:30px; letter-spacing:5px; font-weight:bold; color:#007bff;">
          ${otp}
        </span>
      </div>
      
      <p>This OTP is valid for <b>5 minutes</b>.</p>
      
      <p>If you didn't request this, please ignore this email.</p>
      
      <hr/>
      <p style="font-size:12px; color:gray; text-align:center;">
        © 2026 Lead Management System
      </p>
    </div>
  </div>
  `;
};

module.exports = otpTemplate;