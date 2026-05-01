// controllers/Auth.js
const User = require("../modals/User");
const OTP = require("../modals/OTP");
const Blacklist = require("../modals/Blacklist");

const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const mailSender = require("../utils/mailSender");
const resetTemplate = require("../mail/templetes/resetPasswordTemplete");
const Notification = require("../modals/Notification");

const isProduction = process.env.NODE_ENV === "production";

const authCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const clearAuthCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
};

// Generate Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};


// SEND OTP
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        await OTP.create({ email, otp });

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.log("sendOTP Error:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP",
        });
    }
};


// SIGNUP
exports.signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, otp } = req.body;

        if (!name || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Verify OTP - get the most recent one
        const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            isVerified: true,
            isApproved: false,
        });

        // Notify Super Admin
        try {
          await Notification.create({
            title: "New Admin Registration",
            message: `${name} has registered and is waiting for approval.`,
            recipientRole: "superadmin"
          });
        } catch (err) {
           console.error("Notification creation failed:", err);
        }

        // Clean up all OTPs for this email
        await OTP.deleteMany({ email });

        res.status(201).json({
            success: true,
            message: "Signup successful. Wait for approval",
        });

    } catch (error) {
        console.log("Signup Error:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Signup failed",
        });
    }
};


// REGISTER USER (no OTP — direct signup for lead-creators)
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
            isApproved: true,  // users don't require approval
            isActive: true,
        });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userObj,
        });

    } catch (error) {
        console.log("registerUser Error:", error.message || error);
        return res.status(500).json({
            success: false,
            message: "User registration failed",
        });
    }
};


// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // SUPER ADMIN LOGIN
        if (
            email === process.env.SUPER_ADMIN_EMAIL &&
            password === process.env.SUPER_ADMIN_PASSWORD
        ) {
            const token = jwt.sign(
                { role: "superadmin" },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            return res.cookie("token", token, authCookieOptions).status(200).json({
                success: true,
                role: "superadmin",
                token,
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

      

        if (!user.isApproved) {
            return res.status(403).json({
                success: false,
                message: "Wait for approval",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account deactivated",
            });
        }

        const token = generateToken(user);

        // Remove password from user object before sending
        const userObj = user.toObject();
        delete userObj.password;

        res.cookie("token", token, authCookieOptions).status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userObj,
        });

    } catch (error) {
        console.log("Login Error:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};


// LOGOUT (BLACKLIST)
exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No token provided",
            });
        }

        await Blacklist.create({ token });

        res.clearCookie("token", clearAuthCookieOptions).status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        console.log("Logout Error:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};


// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const token = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;

        await user.save();

        const url = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;

        await mailSender(
            email,
            "Reset Password",
            resetTemplate(url)
        );

        res.status(200).json({
            success: true,
            message: "Reset link sent",
        });

    } catch (error) {
        console.log("Forgot Password Error:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Failed to send reset link",
        });
    }
};


// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error) {
        console.log("Reset Password Error:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Password reset failed",
        });
    }
};


// CHANGE PASSWORD (Logged-in user)
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        console.log("Change Password Error:", error.message || error);
        res.status(500).json({
            success: false,
            message: "Password change failed",
        });
    }
};
