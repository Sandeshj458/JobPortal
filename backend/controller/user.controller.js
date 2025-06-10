import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sendEmail from "../utils/send-email.js";
// import UAParser from 'ua-parser-js';
// import pkg from 'ua-parser-js';

// const UAParser = pkg.UAParser;
import { UAParser } from "ua-parser-js"; // ✅ FIXED

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    // Phone number validation (must be exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits.",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const hashedPassword = await bcrypt.hash(password, 10);

    let access = false;

    if (role === "jobseeker") {
      access = true; // Automatically allow JobSeekers
    } else if (role === "recruiter") {
      access = false; // Recruiters need approval
    }

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      access,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    // ✅ Send registration email
    // await sendEmail(
    //   email,
    //   "Registration Successful",
    //   `<p>Hi ${fullname},<br/>Welcome to our Job Portal! Your account has been created successfully.</p>`
    // );

    await sendEmail(
      email,
      "🎉 Registration Successful - Job Portal",
      `
    <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4CAF50;">🎉 Welcome, ${fullname}!</h2>
      <p>Thank you for registering on our <strong>Job Portal</strong>.</p>
      <p>
        You have successfully registered as a 
        <strong style="color: #2196F3; text-transform: capitalize;">${role}</strong>.
      </p>

      <hr style="margin: 16px 0;" />

      <p>✨ <strong>What's next?</strong></p>
      <ul style="line-height: 1.6;">
        <li>If you're a <strong>Jobseeker</strong> – you can now explore and apply for jobs immediately.</li>
        <li>If you're a <strong>Recruiter</strong> – your account will be activated once approved by the admin.</li>
      </ul>

      <p style="margin-top: 16px;">We’re excited to have you on board! 🚀</p>
      
      <p style="color: #888; font-size: 12px; margin-top: 24px;">
        If you didn’t sign up for this account, please ignore this email.
      </p>
    </div>
  `
    );

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong.",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Check role is correct or not
    if (role != user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    // Check access permissions
    if (role === "recruiter" && !user.access) {
      return res.status(403).json({
        message: "Recruiter account is pending admin approval.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    // Get device info
    const parser = new UAParser();
    parser.setUA(req.headers["user-agent"]);
    console.log("Parsed UA:", parser.getResult());

    const result = parser.getResult();
    const browserName = result.browser.name || "Unknown browser";
    const osName = result.os.name || "Unknown OS";

    // Send login alert email
    // await sendEmail(
    //   email,
    //   "Login Alert",
    //   `<p>Hi ${user.fullname},</p>
    //    <p>You logged in successfully to your account.</p>
    //    <p><strong>Device:</strong> ${browserName} on ${osName}</p>
    //    <p>If this wasn't you, please secure your account immediately.</p>`
    // );

    await sendEmail(
      email,
      "🔐 New Login Alert - Job Portal",
      `
    <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #FF9800;">🔐 Hello, ${user.fullname}!</h2>
      <p>We detected a successful login to your <strong>Job Portal</strong> account.</p>

      <table style="margin-top: 12px; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 8px;"><strong>👤 Role:</strong></td>
          <td style="padding: 4px 8px; text-transform: capitalize;">${
            user.role
          }</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px;"><strong>💻 Device:</strong></td>
          <td style="padding: 4px 8px;">${browserName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px;"><strong>🖥️ Operating System:</strong></td>
          <td style="padding: 4px 8px;">${osName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px;"><strong>🕒 Time:</strong></td>
          <td style="padding: 4px 8px;">${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "long",
            timeStyle: "short",
          })}</td>
        </tr>
      </table>

      <p style="margin-top: 16px;">
        If this was <strong>you</strong>, no action is needed.
        If this seems suspicious, please <a href="#" style="color: #f44336; font-weight: bold;">secure your account</a> immediately.
      </p>

      <p style="color: #888; font-size: 12px; margin-top: 24px;">
        This email was sent for your account’s security on the Job Portal.
      </p>
    </div>
  `
    );

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out Successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;

    // cloudinary come here
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    // updating data
    if (fullname) {
      user.fullname = fullname;
    }
    if (email) {
      user.email = email;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (bio) {
      user.profile.bio = bio;
    }
    if (skillsArray) {
      user.profile.skills = skillsArray;
    }

    // resume comes later here....
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; // Save the cloudinary url
      user.profile.resumeOriginalName = file.originalname; // Save the original file name
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
