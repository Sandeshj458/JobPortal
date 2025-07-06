import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sendEmail from "../utils/send-email.js";
import { Otp } from "../models/otp.model.js";

import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { DeletionLog } from "../models/DeletionLog.model.js";

import { UAParser } from "ua-parser-js"; // ✅ FIXED
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role, education } =
      req.body;

    if (
      !fullname ||
      !email ||
      !phoneNumber ||
      !password ||
      !role ||
      !education
    ) {
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

    // ✅ Convert education to array if it's a string
    let educationArray = [];
    if (Array.isArray(education)) {
      educationArray = education;
    } else if (typeof education === "string") {
      educationArray = education
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    // Upload profile image
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
      // education,
      profile: {
        profilePhoto: cloudResponse.secure_url,
        education: educationArray,
      },
    });

    // ✅ Send Welcome Email to User
    await sendEmail(
      email,
      "🎉 Registration Successful - Job Portal",
      `
      <div style="max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#ffffff;">
        <div style="background-color:#4CAF50;color:#fff;padding:20px;border-top-left-radius:10px;border-top-right-radius:10px;text-align:center;">
          <h2 style="margin:0;">🎉 Welcome, ${fullname}!</h2>
        </div>
        <div style="padding:20px;color:#333;">
          <p style="font-size:16px;">Thank you for registering on our <strong style="color:#0B5ED7;">Job Portal</strong>.</p>
          <p style="font-size:15px;">
            You've successfully signed up as a <strong style="color:#2196F3; text-transform:capitalize;">${role}</strong>.
          </p>
          <div style="margin-top:24px;">
            <h3 style="margin-bottom:8px;color:#555;">✨ What's Next?</h3>
            <ul style="padding-left:20px;line-height:1.7;font-size:14px;">
              <li><strong>Jobseekers:</strong> Start exploring and applying for jobs immediately.</li>
              <li><strong>Recruiters:</strong> Your account will be activated after admin approval.</li>
            </ul>
          </div>
          <p style="margin-top:24px;font-size:15px;">We’re excited to have you on board! 🚀</p>
        </div>
        <div style="background-color:#f9f9f9;padding:15px;text-align:center;font-size:13px;color:#888;border-bottom-left-radius:10px;border-bottom-right-radius:10px;">
          If you didn’t sign up for this account, please ignore this email.
        </div>
      </div>
      `
    );

    await sendEmail(
      process.env.ADMIN_EMAIL_USER,
      `🆕 New Registration - ${fullname}`,
      `
  <div style="max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 10px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); overflow: hidden;">
    
    <div style="background-color: #0B5ED7; color: white; padding: 24px; text-align: center;">
      <h2 style="margin: 0; font-size: 22px;">🆕 New User Registered</h2>
    </div>

    <div style="padding: 24px; color: #111827; font-size: 15px;">
      <p style="margin: 0 0 12px;"><strong>Name:</strong> ${fullname}</p>
      <p style="margin: 0 0 12px;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 0 0 12px;"><strong>Phone:</strong> ${phoneNumber}</p>
      <p style="margin: 0 0 12px;"><strong>Role:</strong> <span style="text-transform: capitalize;">${role}</span></p>
      <p style="margin: 0 0 12px;"><strong>Access Status:</strong> 
        <span style="color: ${
          access ? "#16a34a" : "#dc2626"
        }; font-weight: bold;">
          ${access ? "Approved ✅" : "Pending Approval ⏳"}
        </span>
      </p>
    </div>

    <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 13px; color: #6b7280;">
      📬 This is an automated notification from the Job Portal System.
    </div>
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
    const { fullname, email, phoneNumber, bio, skills, experience, education } =
      req.body;
    const file = req.file;
    const userId = req.id;

    // ✅ Enforce PDF-only upload (before Cloudinary)
    if (file && file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF resumes are allowed." });
    }

    let skillsArray = [];
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === "string") {
        skillsArray = skills.split(",").map((s) => s.trim());
      }
    }

    let educationArray = [];
    if (education) {
      if (Array.isArray(education)) {
        educationArray = education;
      } else if (typeof education === "string") {
        educationArray = education
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e);
      }
    }

    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    // ✅ Update profile fields
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skillsArray.length > 0) user.profile.skills = skillsArray;
    if (experience !== undefined) user.profile.experience = Number(experience);
    if (educationArray.length > 0) user.profile.education = educationArray;

    // ✅ Upload resume to Cloudinary if file exists
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
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
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const sendOtp = async (req, res) => {
  const { email, password, role, purpose = "login" } = req.body;

  if (!email || !purpose) {
    return res
      .status(400)
      .json({ message: "Missing email or purpose", success: false });
  }

  try {
    const user = await User.findOne({ email });
    console.log("Email : ", user);
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found", success: false });

    if (purpose === "login") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Invalid credentials", success: false });

      if (role !== user.role)
        return res.status(400).json({
          message: "Account doesn't exist with current role.",
          success: false,
        });

      if (role === "recruiter" && !user.access)
        return (
          res
            .status(403)
            .json({
               message: `Recruiter approval pending. Please send your verification documents to: ${process.env.ADMIN_EMAIL_USER}`,
              success: false,
            })
        );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();

    let otpDoc = await Otp.findOne({ email });
    if (!otpDoc) {
      otpDoc = new Otp({ email });
    }

    if (purpose === "login") {
      const last = otpDoc.loginLastRequestAt || new Date(0);
      const diff = now - last;

      if (diff < 15 * 60 * 1000 && otpDoc.loginRequestCount >= 5) {
        return res.status(429).json({
          message: "Too many login OTPs. Try again after 15 minutes.",
        });
      }

      otpDoc.loginRequestCount =
        diff > 15 * 60 * 1000 ? 1 : otpDoc.loginRequestCount + 1;
      otpDoc.loginLastRequestAt = now;
      otpDoc.loginOtp = otp;
      otpDoc.loginCreatedAt = now;
    }

    if (purpose === "reset-password") {
      const last = otpDoc.forgotLastRequestAt || new Date(0);
      const diff = now - last;

      if (diff < 15 * 60 * 1000 && otpDoc.forgotRequestCount >= 5) {
        return res.status(429).json({
          message: "Too many forgot-password OTPs. Try again after 15 minutes.",
        });
      }

      otpDoc.forgotRequestCount =
        diff > 15 * 60 * 1000 ? 1 : otpDoc.forgotRequestCount + 1;
      otpDoc.forgotLastRequestAt = now;
      otpDoc.forgotOtp = otp;
      otpDoc.forgotCreatedAt = now;
    }

    if (purpose === "delete-account") {
      const last = otpDoc.deleteLastRequestAt || new Date(0);
      const diff = now - last;
      if (diff < 15 * 60 * 1000 && otpDoc.deleteRequestCount >= 5) {
        return res.status(429).json({
          message: "Too many OTPs. Try again after 15 minutes.",
        });
      }
      otpDoc.deleteRequestCount =
        diff > 15 * 60 * 1000 ? 1 : otpDoc.deleteRequestCount + 1;
      otpDoc.deleteLastRequestAt = now;
      otpDoc.deleteOtp = otp;
      otpDoc.deleteCreatedAt = now;
    }

    await otpDoc.save();

    let subject = "";
    if (purpose === "reset-password") {
      subject = "🔐 Reset Password OTP";
    } else if (purpose === "delete-account") {
      subject = "⚠️ Delete Account OTP";
    } else {
      subject = "🔐 Your OTP for Secure Login";
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f4f4f4; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">

          <h2 style="margin: 0;">${
            purpose === "reset-password"
              ? "🔐 Reset Password"
              : purpose === "delete-account"
              ? "⚠️ Delete Account"
              : "🔐 Login Verification"
          }</h2>


        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; color: #333;">Hi there,</p>
          <p style="font-size: 16px; color: #333;">
            Use the following OTP to ${
              purpose === "reset-password"
                ? "reset your password"
                : "complete your login"
            }:
          </p>

          <p style="font-size: 28px; font-weight: bold; color: #1e3a8a; text-align: center; margin: 30px 0;">
            ${otp}
          </p>

          <p style="font-size: 14px; color: #555; text-align: center;">⚠️ This OTP is valid for <b>60 seconds</b> only.</p>
          <hr style="margin: 30px 0;" />

          <p style="font-size: 14px; color: #999; text-align: center;">
            If you did not request this OTP, please ignore this email.
          </p>
        </div>
      </div>
    `;

    await sendEmail(email, subject, html);

    return res
      .status(200)
      .json({ message: "OTP sent to your email", success: true });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const verifyOtp = async (req, res) => {
  const {
    email,
    otp,
    purpose = "login",
    password,
    role,
    newPassword,
  } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ message: "Email and OTP required", success: false });
  }

  try {
    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc)
      return res.status(401).json({ message: "OTP not found", success: false });

    const now = Date.now();
    let valid = false;

    // ✅ Validate OTP based on purpose
    if (purpose === "login" && otpDoc.loginOtp === otp) {
      const isExpired =
        now - new Date(otpDoc.loginCreatedAt).getTime() > 60 * 1000;
      if (isExpired) {
        await Otp.updateOne(
          { email },
          { $unset: { loginOtp: "", loginCreatedAt: "" } }
        );
        return res.status(401).json({ message: "OTP expired", success: false });
      }
      valid = true;
    }

    if (purpose === "reset-password" && otpDoc.forgotOtp === otp) {
      const isExpired =
        now - new Date(otpDoc.forgotCreatedAt).getTime() > 60 * 1000;
      if (isExpired) {
        await Otp.updateOne(
          { email },
          { $unset: { forgotOtp: "", forgotCreatedAt: "" } }
        );
        return res.status(401).json({ message: "OTP expired", success: false });
      }
      valid = true;
    }

    if (!valid)
      return res.status(401).json({ message: "Invalid OTP", success: false });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    // ✅ Handle RESET PASSWORD
    if (purpose === "reset-password") {
      if (!newPassword) {
        return (
          res
            .status(400)
            .json({
              message: "Please enter a new password",
              success: false,
            })
        );
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      await Otp.updateOne(
        { email },
        { $unset: { forgotOtp: "", forgotCreatedAt: "" } }
      );

      await sendEmail(
        email,
        "✅ Password Reset Successfully - Job Portal",
        `
  <div style="max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#ffffff;">
    <div style="background-color:#4CAF50;color:#ffffff;padding:20px 30px;border-top-left-radius:10px;border-top-right-radius:10px;text-align:center;">
      <h2 style="margin:0;font-size:22px;">✅ Password Reset Successful</h2>
    </div>

    <div style="padding:24px 30px;color:#333;">
      <p style="font-size:16px;margin:0 0 10px;">Hi <strong>${
        user.fullname
      }</strong>,</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 20px;">
        Your password has been successfully reset for your <strong>Job Portal</strong> account.
      </p>

      <p style="font-size:14px;color:#555;margin-bottom:20px;">
        <strong>🕒 Time:</strong> ${new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}
      </p>

      <p style="font-size:15px;line-height:1.6;color:#d32f2f;">
        ⚠️ If you did not perform this action, please <a href="${process.env.RENDER_DEPLOY_LINK}" style="color:#d32f2f;text-decoration:underline;">contact our support team</a> immediately to secure your account.
      </p>
    </div>

    <div style="background-color:#f0f0f0;padding:16px;text-align:center;font-size:13px;color:#777;border-bottom-left-radius:10px;border-bottom-right-radius:10px;">
      This is an automated confirmation from Job Portal. If you need help, visit <a href="${process.env.RENDER_DEPLOY_LINK}" style="color:#1976D2;text-decoration:none;">Support Center</a>.
    </div>
  </div>
  `
      );

      return res
        .status(200)
        .json({ message: "Password updated successfully", success: true });
    }

    // ✅ Handle LOGIN
    if (!password || !role) {
      return res
        .status(400)
        .json({ message: "Missing login credentials", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    if (role === "recruiter" && !user.access) {
      return res
        .status(403)
        .json({ message: "Recruiter not approved", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    await Otp.updateOne(
      { email },
      { $unset: { loginOtp: "", loginCreatedAt: "" } }
    );

    // 👉 Get device and browser info
    const parser = new UAParser(req.headers["user-agent"]);
    const browserName = parser.getBrowser().name || "Unknown";
    const osName = parser.getOS().name || "Unknown";

    await sendEmail(
      email,
      "🔐 New Login Alert - Job Portal",
      `
  <div style="max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#ffffff;">
    <div style="background-color:#FF9800;color:#fff;padding:20px;border-top-left-radius:10px;border-top-right-radius:10px;text-align:center;">
      <h2 style="margin:0;">New Login Alert</h2>
    </div>

    <div style="padding:20px;color:#333;">
      <p style="font-size:16px;">Hello <strong>${user.fullname}</strong>,</p>

      <p style="font-size:15px;">You successfully logged in to your <strong>Job Portal</strong> account.</p>

      <table style="margin-top:20px;width:100%;font-size:14px;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;font-weight:bold;width:40%;">👤 Role:</td>
          <td style="padding:8px;">${user.role}</td>
        </tr>
        <tr style="background-color:#f9f9f9;">
          <td style="padding:8px;font-weight:bold;">💻 Device:</td>
          <td style="padding:8px;">${browserName}</td>
        </tr>
        <tr>
          <td style="padding:8px;font-weight:bold;">🖥 OS:</td>
          <td style="padding:8px;">${osName}</td>
        </tr>
        <tr style="background-color:#f9f9f9;">
          <td style="padding:8px;font-weight:bold;">🕒 Time:</td>
          <td style="padding:8px;">${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}</td>
        </tr>
      </table>

      <p style="margin-top:24px;font-size:14px;">
        If this wasn't you, <a href="${process.env.RENDER_DEPLOY_LINK}" style="color:#d32f2f;text-decoration:underline;">secure your account</a> immediately.
      </p>
    </div>

    <div style="background-color:#f0f0f0;padding:15px;text-align:center;font-size:13px;color:#888;border-bottom-left-radius:10px;border-bottom-right-radius:10px;">
      This is an automated alert from Job Portal.
    </div>
  </div>
  `
    );

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 86400000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        success: true,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile,
        },
        token,
      });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const deleteAccount = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res
      .status(400)
      .json({ message: "Email and OTP required", success: false });

  try {
    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc || otpDoc.deleteOtp !== otp)
      return res.status(400).json({ message: "Invalid OTP", success: false });

    const isExpired =
      Date.now() - new Date(otpDoc.deleteCreatedAt).getTime() > 60 * 1000;
    if (isExpired) {
      await Otp.updateOne(
        { email },
        { $unset: { deleteOtp: "", deleteCreatedAt: "" } }
      );
      return res.status(400).json({ message: "OTP expired", success: false });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    let deletionCounts = {};

    if (user.role === "recruiter") {
      const jobs = await Job.find({ created_by: user._id });
      const applicationIds = jobs
        .flatMap((job) => job.applications)
        .filter(Boolean);

      deletionCounts.applications = await Application.deleteMany({
        _id: { $in: applicationIds },
      });

      await Job.updateMany(
        { applications: { $in: applicationIds } },
        { $pull: { applications: { $in: applicationIds } } }
      );

      // ✅ Corrected recruiter field reference
      deletionCounts.jobs = await Job.deleteMany({ created_by: user._id });
      deletionCounts.companies = await Company.deleteMany({
  userId: user._id, // ✅ this field matches your Company schema
});

    } 
    else if (user.role === "jobseeker") {
      const applications = await Application.find(
        { applicant: user._id },
        "_id"
      );
      const applicationIds = applications.map((app) => app._id);

      deletionCounts.applications = await Application.deleteMany({
        _id: { $in: applicationIds },
      });

      await Job.updateMany(
        { applications: { $in: applicationIds } },
        { $pull: { applications: { $in: applicationIds } } }
      );
    }

    await Otp.deleteOne({ email });
    await User.deleteOne({ _id: user._id });

    await DeletionLog.create({
      email,
      role: user.role,
      details: { ...deletionCounts },
    });

    // Email to Admin
    await sendEmail(
        process.env.ADMIN_EMAIL_USER,
      `🚨 Account Deleted: ${email}`,
      generateDeletionEmailContent(email, user.role, deletionCounts)
    );

    await sendEmail(
      email,
      "✅ Your Job Portal Account Has Been Deleted",
      `
  <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', Roboto, Arial, sans-serif; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
    <div style="background-color: #dc2626; color: white; padding: 24px; text-align: center;">
      <h2 style="margin: 0; font-size: 24px;">Account Deleted</h2>
    </div>

    <div style="padding: 24px; background-color: #ffffff;">
      <p style="font-size: 16px; color: #111827;">Hello <strong>${email}</strong>,</p>
      <p style="font-size: 15px; color: #374151; line-height: 1.6;">
        Your account registered as a <strong style="text-transform: capitalize;">${user.role}</strong> has been permanently deleted from our Job Portal system.
      </p>
      <p style="font-size: 15px; color: #374151; line-height: 1.6;">
        We're sorry to see you go. If this was done in error or you change your mind, please reach out to our support team as soon as possible.
      </p>

      <div style="margin: 30px 0; text-align: center;">
        <a href="mailto:${process.env.ADMIN_EMAIL_USER}" style="background-color: #0B5ED7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          📩 Contact Support
        </a>
      </div>

      <p style="font-size: 13px; color: #6b7280; text-align: center;">
        This is an automated email from Job Portal System.<br/>
        Please do not reply directly to this email.
      </p>
    </div>
  </div>
  `
    );

    return res
      .status(200)
      .clearCookie("token")
      .json({ message: "Account deleted successfully", success: true });
  } catch (err) {
    console.error("Delete Account Error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// Helper to generate deletion summary HTML
function generateDeletionEmailContent(email, role, deletionCounts) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #dc2626;">⚠️ User Account Deleted</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px; font-weight: bold; background-color: #f3f4f6;">Email</td>
          <td style="padding: 8px; background-color: #f9fafb;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; background-color: #f3f4f6;">Role</td>
          <td style="padding: 8px; background-color: #f9fafb;">${role}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; background-color: #f3f4f6;">Deleted At</td>
          <td style="padding: 8px; background-color: #f9fafb;">${new Date().toLocaleString()}</td>
        </tr>
      </table>
      <div style="margin-bottom: 20px;">
        <h3 style="color: #4b5563;">🗑️ Deletion Summary</h3>
        <ul style="list-style: none; padding-left: 0;">
          ${Object.entries(deletionCounts)
            .map(
              ([key, val]) => `
                <li style="margin: 6px 0; padding: 6px; background-color: #f3f4f6; border-radius: 4px;">
                  <strong>${
                    key.charAt(0).toUpperCase() + key.slice(1)
                  }:</strong> ${val.deletedCount}
                </li>
              `
            )
            .join("")}
        </ul>
      </div>
      <p style="font-size: 13px; color: #6b7280; text-align: center;">
        This is an automated alert from the Job Portal System.<br/>
        If you have questions, contact the admin team.
      </p>
    </div>
  `;
}
