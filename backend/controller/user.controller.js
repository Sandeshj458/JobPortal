import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import sendEmail from "../utils/send-email.js";
import { Otp } from "../models/otp.model.js";
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

// export const login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     if (!email || !password || !role) {
//       return res.status(400).json({
//         message: "Something is missing",
//         success: false,
//       });
//     }
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         message: "Incorrect email or password.",
//         success: false,
//       });
//     }
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(400).json({
//         message: "Incorrect email or password.",
//         success: false,
//       });
//     }

//     // Check role is correct or not
//     if (role != user.role) {
//       return res.status(400).json({
//         message: "Account doesn't exist with current role.",
//         success: false,
//       });
//     }

//     // Check access permissions
//     if (role === "recruiter" && !user.access) {
//       return res.status(403).json({
//         message: "Recruiter account is pending admin approval.",
//         success: false,
//       });
//     }

//     const tokenData = {
//       userId: user._id,
//     };

//     const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
//       expiresIn: "1d",
//     });

//     // Get device info
//     const parser = new UAParser();
//     parser.setUA(req.headers["user-agent"]);
//     console.log("Parsed UA:", parser.getResult());

//     const result = parser.getResult();
//     const browserName = result.browser.name || "Unknown browser";
//     const osName = result.os.name || "Unknown OS";

//     // Send login alert email
//     // await sendEmail(
//     //   email,
//     //   "Login Alert",
//     //   `<p>Hi ${user.fullname},</p>
//     //    <p>You logged in successfully to your account.</p>
//     //    <p><strong>Device:</strong> ${browserName} on ${osName}</p>
//     //    <p>If this wasn't you, please secure your account immediately.</p>`
//     // );

//     await sendEmail(
//       email,
//       "🔐 New Login Alert - Job Portal",
//       `
//     <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;">
//       <h2 style="color: #FF9800;">🔐 Hello, ${user.fullname}!</h2>
//       <p>We detected a successful login to your <strong>Job Portal</strong> account.</p>

//       <table style="margin-top: 12px; border-collapse: collapse;">
//         <tr>
//           <td style="padding: 4px 8px;"><strong>👤 Role:</strong></td>
//           <td style="padding: 4px 8px; text-transform: capitalize;">${
//             user.role
//           }</td>
//         </tr>
//         <tr>
//           <td style="padding: 4px 8px;"><strong>💻 Device:</strong></td>
//           <td style="padding: 4px 8px;">${browserName}</td>
//         </tr>
//         <tr>
//           <td style="padding: 4px 8px;"><strong>🖥️ Operating System:</strong></td>
//           <td style="padding: 4px 8px;">${osName}</td>
//         </tr>
//         <tr>
//           <td style="padding: 4px 8px;"><strong>🕒 Time:</strong></td>
//           <td style="padding: 4px 8px;">${new Date().toLocaleString("en-IN", {
//             timeZone: "Asia/Kolkata",
//             dateStyle: "long",
//             timeStyle: "short",
//           })}</td>
//         </tr>
//       </table>

//       <p style="margin-top: 16px;">
//         If this was <strong>you</strong>, no action is needed.
//         If this seems suspicious, please <a href="#" style="color: #f44336; font-weight: bold;">secure your account</a> immediately.
//       </p>

//       <p style="color: #888; font-size: 12px; margin-top: 24px;">
//         This email was sent for your account’s security on the Job Portal.
//       </p>
//     </div>
//   `
//     );

//     user = {
//       _id: user._id,
//       fullname: user.fullname,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       role: user.role,
//       profile: user.profile,
//     };

//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
//         httpsOnly: true,
//         sameSite: "strict",
//       })
//       .json({
//         message: `Welcome back ${user.fullname}`,
//         user,
//         success: true,
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };

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

// export const sendOtp = async (req, res) => {
//   const { email, password, role } = req.body;

//   if (!email || !password || !role) {
//     return res
//       .status(400)
//       .json({ message: "Missing credentials", success: false });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(400)
//         .json({ message: "Incorrect email or password.", success: false });

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch)
//       return res
//         .status(400)
//         .json({ message: "Incorrect email or password.", success: false });

//     if (role !== user.role) {
//       return res.status(400).json({
//         message: "Account doesn't exist with current role.",
//         success: false,
//       });
//     }

//     if (role === "recruiter" && !user.access) {
//       return res.status(403).json({
//         message: "Recruiter account is pending admin approval.",
//         success: false,
//       });
//     }

//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//     await Otp.findOneAndUpdate(
//       { email },
//       {
//         otp: otpCode,
//         createdAt: Date.now(),
//         lastRequestAt: Date.now(),
//         $inc: { requestCount: 1 },
//       },
//       { upsert: true, new: true }
//     );

//     await sendEmail(
//       email,
//       "🔐 Your OTP for Secure Login",
//       `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f4f4f4; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
//       <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
//         <h2 style="margin: 0;">🔐 Login Verification</h2>
//       </div>

//       <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
//         <p style="font-size: 16px; color: #333;">Hi there,</p>
//         <p style="font-size: 16px; color: #333;">Use the following OTP to complete your login:</p>

//         <p style="font-size: 28px; font-weight: bold; color: #1e3a8a; text-align: center; margin: 30px 0;">
//           ${otpCode}
//         </p>

//         <p style="font-size: 14px; color: #555; text-align: center;">⚠️ This OTP is valid for <b>60 seconds</b> only.</p>
//         <hr style="margin: 30px 0;" />

//         <p style="font-size: 14px; color: #999; text-align: center;">
//           If you did not request this OTP, please ignore this email.
//         </p>
//       </div>
//     </div>
//   `
//     );

//     res.status(200).json({ message: "OTP sent to your email", success: true });
//   } catch (err) {
//     console.error("Send OTP error:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const sendOtp = async (req, res) => {
//   const { email, password, role, purpose = "login" } = req.body;

//   if (!email || (purpose === "login" && (!password || !role))) {
//     return res
//       .status(400)
//       .json({ message: "Missing required fields", success: false });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "User not found.", success: false });
//     }

//     if (purpose === "login") {
//       const isPasswordMatch = await bcrypt.compare(password, user.password);
//       if (!isPasswordMatch)
//         return res
//           .status(400)
//           .json({ message: "Incorrect email or password.", success: false });

//       if (role !== user.role) {
//         return res.status(400).json({
//           message: "Account doesn't exist with current role.",
//           success: false,
//         });
//       }

//       if (role === "recruiter" && !user.access) {
//         return res.status(403).json({
//           message: "Recruiter account is pending admin approval.",
//           success: false,
//         });
//       }
//     }

//     // Check existing OTP record
//     const otpRecord = await Otp.findOne({ email });
//     const now = Date.now();

//     // Handle rate limit: max 5 requests in 15 minutes
//     if (otpRecord) {
//       const timeSinceLast = now - new Date(otpRecord.lastRequestAt).getTime();

//       if (timeSinceLast < 15 * 60 * 1000 && otpRecord.requestCount >= 5) {
//         return res.status(429).json({
//           message: "Too many OTP requests. Please try again after 15 minutes.",
//           success: false,
//         });
//       }

//       // If more than 15 minutes have passed, reset count
//       if (timeSinceLast > 15 * 60 * 1000) {
//         otpRecord.requestCount = 0;
//       }
//     }

//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//     await Otp.findOneAndUpdate(
//       { email },
//       {
//         otp: otpCode,
//         createdAt: now,
//         lastRequestAt: now,
//         $inc: { requestCount: 1 },
//       },
//       { upsert: true, new: true }
//     );

// export const sendOtp = async (req, res) => {
//   const { email, password, role, purpose = "login" } = req.body;

//   if (!email || !purpose) {
//     return res.status(400).json({ message: "Missing email or purpose", success: false });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ message: "User not found", success: false });

//     // Login validation (optional for other purposes)
//     if (purpose === "login") {
//       const isPasswordMatch = await bcrypt.compare(password, user.password);
//       if (!isPasswordMatch)
//         return res.status(400).json({ message: "Invalid credentials", success: false });
//       if (role !== user.role)
//         return res.status(400).json({ message: "Role mismatch", success: false });
//       if (role === "recruiter" && !user.access)
//         return res.status(403).json({ message: "Recruiter approval pending", success: false });
//     }

//     const now = Date.now();
//     const otpRecord = await Otp.findOne({ email, type: purpose });

//     if (otpRecord) {
//       const timeSinceLast = now - new Date(otpRecord.lastRequestAt).getTime();
//       if (timeSinceLast < 15 * 60 * 1000 && otpRecord.requestCount >= 5) {
//         return res.status(429).json({
//           message: "Too many OTP requests. Try again after 15 minutes.",
//           success: false,
//         });
//       }
//       if (timeSinceLast > 15 * 60 * 1000) {
//         otpRecord.requestCount = 0;
//       }
//     }

//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

//     await Otp.findOneAndUpdate(
//       { email, type: purpose },
//       {
//         otp: otpCode,
//         createdAt: now,
//         lastRequestAt: now,
//         type: purpose,
//         $inc: { requestCount: 1 },
//       },
//       { upsert: true, new: true }
//     );

// export const sendOtp = async (req, res) => {
//   const { email, password, role, purpose = "login" } = req.body;

//   if (!email || !purpose) {
//     return res
//       .status(400)
//       .json({ message: "Missing email or purpose", success: false });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(400)
//         .json({ message: "User not found", success: false });

//     if (purpose === "login") {
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch)
//         return res
//           .status(400)
//           .json({ message: "Invalid credentials", success: false });

//       if (role !== user.role)
//         return res
//           .status(400)
//           .json({ message: "Account doesn't exist with current role.", success: false });

//       if (role === "recruiter" && !user.access)
//         return res
//           .status(403)
//           .json({ message: "Recruiter approval pending", success: false });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     // const now = Date.now();
//     const now = new Date();

//     let otpDoc = await Otp.findOne({ email });

//     if (!otpDoc) {
//       otpDoc = new Otp({ email });
//       // } else {
//       //   // ✅ Clear old OTP and timestamp if exists
//       //   await Otp.updateOne(
//       //     { email },
//       //     {
//       //       $unset: { otp: "", createdAt: "" },
//       //     }
//       //   );
//       // }

//       //     if (purpose === "login") {
//       //       const last = otpDoc.loginLastRequestAt || new Date(0);
//       //       const diff = now - new Date(last).getTime();

//       //       if (diff < 15 * 60 * 1000 && otpDoc.loginRequestCount >= 5) {
//       //         return res.status(429).json({
//       //           message: "Too many login OTPs. Try again after 15 minutes.",
//       //         });
//       //       }

//       //       // if (diff > 15 * 60 * 1000) otpDoc.loginRequestCount = 0;

//       //       // otpDoc.loginRequestCount += 1;
//       //       // otpDoc.loginLastRequestAt = now;

//       //       // ✅ Automatically reset after 15 minutes
//       //       if (diff > 15 * 60 * 1000) {
//       //          otpDoc.loginRequestCount = 1;
//       //          otpDoc.loginLastRequestAt = now;
//       //       } else {
//       //          otpDoc.loginRequestCount += 1;
//       //          otpDoc.loginLastRequestAt = now;
//       //       }

//       // }

//       if (purpose === "login") {
//         const last = otpDoc.loginLastRequestAt || new Date(0);
//         const diff = now - last;
//         if (diff < 15 * 60 * 1000 && otpDoc.loginRequestCount >= 5) {
//           return res
//             .status(429)
//             .json({
//               message: "Too many login OTPs. Try again after 15 minutes.",
//             });
//         }

//         if (diff > 15 * 60 * 1000) {
//           otpDoc.loginRequestCount = 1;
//         } else {
//           otpDoc.loginRequestCount += 1;
//         }

//         otpDoc.loginLastRequestAt = now;
//         otpDoc.loginOtp = otp;
//         otpDoc.loginCreatedAt = now;
//       }
//     }

//     // if (purpose === "reset-password") {
//     //   const last = otpDoc.forgotLastRequestAt || new Date(0);
//     //   const diff = now - new Date(last).getTime();

//     //   if (diff < 15 * 60 * 1000 && otpDoc.forgotRequestCount >= 5) {
//     //     return res.status(429).json({
//     //       message: "Too many forgot-password OTPs. Try again after 15 minutes.",
//     //     });
//     //   }

//     //   // if (diff > 15 * 60 * 1000) otpDoc.forgotRequestCount = 0;

//     //   // otpDoc.forgotRequestCount += 1;
//     //   // otpDoc.forgotLastRequestAt = now;

//     //   // ✅ Automatically reset after 15 minutes
//     //   if (diff > 15 * 60 * 1000) {
//     //     otpDoc.forgotRequestCount = 1;
//     //     otpDoc.forgotLastRequestAt = now;
//     //   } else {
//     //     otpDoc.forgotRequestCount += 1;
//     //     otpDoc.forgotLastRequestAt = now;
//     //   }

//     // }

//     // // ✅ Set new OTP and timestamp
//     // otpDoc.otp = otp;
//     // otpDoc.createdAt = now;

//     if (purpose === "reset-password") {
//       const last = otpDoc.forgotLastRequestAt || new Date(0);
//       const diff = now - last;
//       if (diff < 15 * 60 * 1000 && otpDoc.forgotRequestCount >= 5) {
//         return res
//           .status(429)
//           .json({
//             message:
//               "Too many forgot-password OTPs. Try again after 15 minutes.",
//           });
//       }

//       if (diff > 15 * 60 * 1000) {
//         otpDoc.forgotRequestCount = 1;
//       } else {
//         otpDoc.forgotRequestCount += 1;
//       }

//       otpDoc.forgotLastRequestAt = now;
//       otpDoc.forgotOtp = otp;
//       otpDoc.forgotCreatedAt = now;
//     }
//     await otpDoc.save();

//     // ✅ Send OTP Email
//     const subject =
//       purpose === "reset-password"
//         ? "🔐 Reset Password OTP"
//         : "🔐 Your OTP for Secure Login";

//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f4f4f4; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
//         <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
//           <h2 style="margin: 0;">🔐 ${
//             purpose === "reset-password"
//               ? "Reset Password"
//               : "Login Verification"
//           }</h2>
//         </div>

//         <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
//           <p style="font-size: 16px; color: #333;">Hi there,</p>
//           <p style="font-size: 16px; color: #333;">
//             Use the following OTP to ${
//               purpose === "reset-password"
//                 ? "reset your password"
//                 : "complete your login"
//             }:
//           </p>

//           <p style="font-size: 28px; font-weight: bold; color: #1e3a8a; text-align: center; margin: 30px 0;">
//             ${otp}
//           </p>

//           <p style="font-size: 14px; color: #555; text-align: center;">⚠️ This OTP is valid for <b>60 seconds</b> only.</p>
//           <hr style="margin: 30px 0;" />

//           <p style="font-size: 14px; color: #999; text-align: center;">
//             If you did not request this OTP, please ignore this email.
//           </p>
//         </div>
//       </div>
//     `;

//     await sendEmail(email, subject, html);

//     return res
//       .status(200)
//       .json({ message: "OTP sent to your email", success: true });
//   } catch (err) {
//     console.error("Send OTP error:", err);
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", success: false });
//   }
// };

export const sendOtp = async (req, res) => {
  const { email, password, role, purpose = "login" } = req.body;

  if (!email || !purpose) {
    return res
      .status(400)
      .json({ message: "Missing email or purpose", success: false });
  }

  try {
    const user = await User.findOne({ email });
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
        return res
          .status(400)
          .json({ message: "Account doesn't exist with current role.", success: false });

      if (role === "recruiter" && !user.access)
        return res
          .status(403)
          .json({ message: "Recruiter approval pending", success: false });
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

      otpDoc.loginRequestCount = diff > 15 * 60 * 1000 ? 1 : otpDoc.loginRequestCount + 1;
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

      otpDoc.forgotRequestCount = diff > 15 * 60 * 1000 ? 1 : otpDoc.forgotRequestCount + 1;
      otpDoc.forgotLastRequestAt = now;
      otpDoc.forgotOtp = otp;
      otpDoc.forgotCreatedAt = now;
    }

    await otpDoc.save();

    const subject =
      purpose === "reset-password"
        ? "🔐 Reset Password OTP"
        : "🔐 Your OTP for Secure Login";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f4f4f4; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h2 style="margin: 0;">🔐 ${
            purpose === "reset-password"
              ? "Reset Password"
              : "Login Verification"
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


// export const verifyOtp = async (req, res) => {
//   const { email, password, role, otp } = req.body;

//   if (!email || !password || !role || !otp) {
//     return res.status(400).json({ message: "Missing fields", success: false });
//   }

//   try {
//     const otpRecord = await Otp.findOne({ email });
//     if (!otpRecord || otpRecord.otp !== otp) {
//       return res
//         .status(401)
//         .json({ message: "Invalid or expired OTP", success: false });
//     }

//     const isExpired =
//       Date.now() - new Date(otpRecord.createdAt).getTime() > 60 * 1000; // 2 minutes
//     if (isExpired) {
//       await Otp.deleteOne({ email });
//       return res.status(401).json({ message: "OTP expired", success: false });
//     }

//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User not found", success: false });

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch)
//       return res
//         .status(400)
//         .json({ message: "Invalid credentials", success: false });

//     const tokenData = { userId: user._id };
//     const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
//       expiresIn: "1d",
//     });

//     // Get device info
//     const parser = new UAParser();
//     parser.setUA(req.headers["user-agent"]);
//     const result = parser.getResult();
//     const browserName = result.browser.name || "Unknown browser";
//     const osName = result.os.name || "Unknown OS";

//     await sendEmail(
//       email,
//       "🔐 New Login Alert - Job Portal",
//       `
//       <div style="font-family: Arial, sans-serif; padding: 16px;">
//         <h2 style="color: #FF9800;">🔐 Hello, ${user.fullname}!</h2>
//         <p>You successfully logged in to your <strong>Job Portal</strong> account.</p>
//         <table style="margin-top: 12px;">
//           <tr><td><strong>👤 Role:</strong></td><td>${user.role}</td></tr>
//           <tr><td><strong>💻 Device:</strong></td><td>${browserName}</td></tr>
//           <tr><td><strong>🖥 OS:</strong></td><td>${osName}</td></tr>
//           <tr><td><strong>🕒 Time:</strong></td><td>${new Date().toLocaleString(
//             "en-IN",
//             { timeZone: "Asia/Kolkata" }
//           )}</td></tr>
//         </table>
//         <p>If this wasn't you, <a href="#">secure your account</a> immediately.</p>
//       </div>
//       `
//     );

//     await Otp.deleteOne({ email }); // ✅ delete OTP after successful login

//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//         sameSite: "strict",
//       })
//       .json({
//         message: `Welcome back ${user.fullname}`,
//         success: true,
//         user: {
//           _id: user._id,
//           fullname: user.fullname,
//           email: user.email,
//           phoneNumber: user.phoneNumber,
//           role: user.role,
//           profile: user.profile,
//         },
//       });
//   } catch (err) {
//     console.error("OTP Verify Error:", err);
//     res.status(500).json({ message: "Internal Server Error", success: false });
//   }
// };

// export const verifyOtp = async (req, res) => {
//   const {
//     email,
//     otp,
//     purpose = "login",
//     password,
//     role,
//     newPassword,
//   } = req.body;

//   if (!email || !otp) {
//     return res
//       .status(400)
//       .json({ message: "Email and OTP required", success: false });
//   }

//   try {
//     const otpRecord = await Otp.findOne({ email });

//     if (!otpRecord || otpRecord.otp !== otp) {
//       return res
//         .status(401)
//         .json({ message: "Invalid or expired OTP", success: false });
//     }

//     const isExpired =
//       Date.now() - new Date(otpRecord.createdAt).getTime() > 60 * 1000;
//     if (isExpired) {
//       // await Otp.deleteOne({ email });
//       await Otp.updateOne(
//   { email },
//   {
//     $unset: { otp: "", createdAt: "" },
//   }
// );
//       return res.status(401).json({ message: "OTP expired", success: false });
//     }

//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User not found", success: false });

//     // ✅ Handle RESET PASSWORD flow
//     if (purpose === "reset-password") {
//       if (!newPassword || newPassword.length < 6) {
//         return res.status(400).json({
//           message: "New password required (min 6 chars)",
//           success: false,
//         });
//       }

//       user.password = await bcrypt.hash(newPassword, 10);
//       await user.save();
//       // await Otp.deleteOne({ email });
//       await Otp.updateOne(
//   { email },
//   {
//     $unset: { otp: "", createdAt: "" },
//   }
// );

//       await sendEmail(
//         email,
//         "✅ Password Reset Successfully - Job Portal",
//         `
//     <div style="font-family: Arial, sans-serif; padding: 16px;">
//       <h2 style="color: green;">✅ Password Reset Confirmed</h2>
//       <p>Hi ${user.fullname},</p>
//       <p>Your password was successfully reset. If this wasn't you, please contact support immediately.</p>
//       <p>Time: <strong>${new Date().toLocaleString("en-IN", {
//         timeZone: "Asia/Kolkata",
//       })}</strong></p>
//     </div>
//     `
//       );

//       return res
//         .status(200)
//         .json({ message: "Password updated successfully", success: true });
//     }

//     // ✅ Handle LOGIN flow
//     if (!password || !role) {
//       return res
//         .status(400)
//         .json({ message: "Missing credentials for login", success: false });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch)
//       return res
//         .status(400)
//         .json({ message: "Invalid credentials", success: false });

//     if (role !== user.role) {
//       return res
//         .status(400)
//         .json({ message: "Incorrect role", success: false });
//     }

//     if (role === "recruiter" && !user.access) {
//       return res.status(403).json({
//         message: "Recruiter account is pending admin approval.",
//         success: false,
//       });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
//       expiresIn: "1d",
//     });

//     const parser = new UAParser();
//     parser.setUA(req.headers["user-agent"]);
//     const result = parser.getResult();
//     const browserName = result.browser.name || "Unknown";
//     const osName = result.os.name || "Unknown";

//     await sendEmail(
//       email,
//       "🔐 New Login Alert - Job Portal",
//       `
//         <div style="font-family: Arial, sans-serif; padding: 16px;">
//           <h2 style="color: #FF9800;">🔐 Hello, ${user.fullname}!</h2>
//           <p>You successfully logged in to your <strong>Job Portal</strong> account.</p>
//           <table style="margin-top: 12px;">
//             <tr><td><strong>👤 Role:</strong></td><td>${user.role}</td></tr>
//             <tr><td><strong>💻 Device:</strong></td><td>${browserName}</td></tr>
//             <tr><td><strong>🖥 OS:</strong></td><td>${osName}</td></tr>
//             <tr><td><strong>🕒 Time:</strong></td><td>${new Date().toLocaleString(
//               "en-IN",
//               { timeZone: "Asia/Kolkata" }
//             )}</td></tr>
//           </table>
//           <p>If this wasn't you, <a href="#">secure your account</a> immediately.</p>
//         </div>
//       `
//     );

//     // await Otp.deleteOne({ email }); // Remove OTP after successful login
//     await Otp.updateOne(
//   { email },
//   {
//     $unset: { otp: "", createdAt: "" },
//   }
// );

//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 1 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//         sameSite: "strict",
//       })
//       .json({
//         message: `Welcome back ${user.fullname}`,
//         success: true,
//         user: {
//           _id: user._id,
//           fullname: user.fullname,
//           email: user.email,
//           phoneNumber: user.phoneNumber,
//           role: user.role,
//           profile: user.profile,
//         },
//       });
//   } catch (err) {
//     console.error("Verify OTP Error:", err);
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", success: false });
//   }
// };

// export const verifyOtp = async (req, res) => {
//   const {
//     email,
//     otp,
//     purpose = "login",
//     password,
//     role,
//     newPassword,
//   } = req.body;

//   if (!email || !otp) {
//     return res
//       .status(400)
//       .json({ message: "Email and OTP required", success: false });
//   }

//   try {
//     const otpDoc = await Otp.findOne({ email });
//     if (!otpDoc)
//       return res.status(401).json({ message: "OTP not found", success: false });

//     const now = Date.now();

//     let valid = false;
//     if (purpose === "login" && otpDoc.loginOtp === otp) {
//       const isExpired =
//         now - new Date(otpDoc.loginCreatedAt).getTime() > 60 * 1000;
//       if (isExpired) {
//         await Otp.updateOne(
//           { email },
//           { $unset: { loginOtp: "", loginCreatedAt: "" } }
//         );
//         return res.status(401).json({ message: "OTP expired", success: false });
//       }
//       valid = true;
//     }

//     if (purpose === "reset-password" && otpDoc.forgotOtp === otp) {
//       const isExpired =
//         now - new Date(otpDoc.forgotCreatedAt).getTime() > 60 * 1000;
//       if (isExpired) {
//         await Otp.updateOne(
//           { email },
//           { $unset: { forgotOtp: "", forgotCreatedAt: "" } }
//         );
//         return res.status(401).json({ message: "OTP expired", success: false });
//       }
//       valid = true;
//     }

//     if (!valid)
//       return res.status(401).json({ message: "Invalid OTP", success: false });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User not found", success: false });

//     // ✅ Handle RESET PASSWORD
//     if (purpose === "reset-password") {
//       if (!newPassword || newPassword.length < 6) {
//         return res
//           .status(400)
//           .json({ message: "New password required", success: false });
//       }

//       user.password = await bcrypt.hash(newPassword, 10);
//       await user.save();

//       await Otp.updateOne(
//         { email },
//         { $unset: { forgotOtp: "", forgotCreatedAt: "" } }
//       );

//       // await sendEmail(email, "✅ Password Reset Confirmed", "Your password was reset successfully.");
//       // return res.status(200).json({ message: "Password updated", success: true });

//       await sendEmail(
//         email,
//         "✅ Password Reset Successfully - Job Portal",
//         `
//     <div style="font-family: Arial, sans-serif; padding: 16px;">
//       <h2 style="color: green;">✅ Password Reset Confirmed</h2>
//       <p>Hi ${user.fullname},</p>
//       <p>Your password was successfully reset. If this wasn't you, please contact support immediately.</p>
//       <p>Time: <strong>${new Date().toLocaleString("en-IN", {
//         timeZone: "Asia/Kolkata",
//       })}</strong></p>
//     </div>
//     `
//       );

//       return res
//         .status(200)
//         .json({ message: "Password updated successfully", success: true });
//     }

//     // ✅ Handle LOGIN
//     if (!password || !role) {
//       return res
//         .status(400)
//         .json({ message: "Missing login credentials", success: false });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res
//         .status(400)
//         .json({ message: "Invalid password", success: false });

//     if (role !== user.role)
//       return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
//     if (role === "recruiter" && !user.access) {
//       return res
//         .status(403)
//         .json({ message: "Recruiter not approved", success: false });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
//       expiresIn: "1d",
//     });

//     await Otp.updateOne(
//       { email },
//       { $unset: { loginOtp: "", loginCreatedAt: "" } }
//     );

//     return res
//       .status(200)
//       .cookie("token", token, {
//         maxAge: 86400000,
//         httpOnly: true,
//         sameSite: "strict",
//       })
//       .json({
//         message: `Welcome back ${user.fullname}`,
//         success: true,
//         user: {
//           _id: user._id,
//           fullname: user.fullname,
//           email: user.email,
//           phoneNumber: user.phoneNumber,
//           role: user.role,
//           profile: user.profile,
//         },
//       });
//   } catch (err) {
//     console.error("Verify OTP Error:", err);
//     return res
//       .status(500)
//       .json({ message: "Internal Server Error", success: false });
//   }
// };


export const verifyOtp = async (req, res) => {
  const {
    email,
    otp,
    purpose = 'login',
    password,
    role,
    newPassword,
  } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP required', success: false });
  }

  try {
    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc) return res.status(401).json({ message: 'OTP not found', success: false });

    const now = Date.now();
    let valid = false;

    // ✅ Validate OTP based on purpose
    if (purpose === 'login' && otpDoc.loginOtp === otp) {
      const isExpired = now - new Date(otpDoc.loginCreatedAt).getTime() > 60 * 1000;
      if (isExpired) {
        await Otp.updateOne({ email }, { $unset: { loginOtp: '', loginCreatedAt: '' } });
        return res.status(401).json({ message: 'OTP expired', success: false });
      }
      valid = true;
    }

    if (purpose === 'reset-password' && otpDoc.forgotOtp === otp) {
      const isExpired = now - new Date(otpDoc.forgotCreatedAt).getTime() > 60 * 1000;
      if (isExpired) {
        await Otp.updateOne({ email }, { $unset: { forgotOtp: '', forgotCreatedAt: '' } });
        return res.status(401).json({ message: 'OTP expired', success: false });
      }
      valid = true;
    }

    if (!valid) return res.status(401).json({ message: 'Invalid OTP', success: false });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    // ✅ Handle RESET PASSWORD
    if (purpose === 'reset-password') {
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: 'New password required', success: false });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      await Otp.updateOne({ email }, { $unset: { forgotOtp: '', forgotCreatedAt: '' } });

      // Send reset confirmation email
      await sendEmail(
        email,
        '✅ Password Reset Successfully - Job Portal',
        `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2 style="color: green;">✅ Password Reset Confirmed</h2>
          <p>Hi ${user.fullname},</p>
          <p>Your password was successfully reset. If this wasn't you, please contact support immediately.</p>
          <p>Time: <strong>${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</strong></p>
        </div>
        `
      );

      return res.status(200).json({ message: 'Password updated successfully', success: true });
    }

    // ✅ Handle LOGIN
    if (!password || !role) {
      return res.status(400).json({ message: 'Missing login credentials', success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password', success: false });

    if (role !== user.role) {
      return res.status(400).json({ message: 'Account doesn\'t exist with current role.', success: false });
    }

    if (role === 'recruiter' && !user.access) {
      return res.status(403).json({ message: 'Recruiter not approved', success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    await Otp.updateOne({ email }, { $unset: { loginOtp: '', loginCreatedAt: '' } });

    // 👉 Get device and browser info
    const parser = new UAParser(req.headers['user-agent']);
    const browserName = parser.getBrowser().name || 'Unknown';
    const osName = parser.getOS().name || 'Unknown';

    // ✅ Send New Login Alert Email
    await sendEmail(
      email,
      '🔐 New Login Alert - Job Portal',
      `
      <div style="font-family: Arial, sans-serif; padding: 16px;">
        <h2 style="color: #FF9800;">🔐 Hello, ${user.fullname}!</h2>
        <p>You successfully logged in to your <strong>Job Portal</strong> account.</p>
        <table style="margin-top: 12px;">
          <tr><td><strong>👤 Role:</strong></td><td>${user.role}</td></tr>
          <tr><td><strong>💻 Device:</strong></td><td>${browserName}</td></tr>
          <tr><td><strong>🖥 OS:</strong></td><td>${osName}</td></tr>
          <tr><td><strong>🕒 Time:</strong></td><td>${new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
          })}</td></tr>
        </table>
        <p>If this wasn't you, <a href="#">secure your account</a> immediately.</p>
      </div>
      `
    );

    return res
      .status(200)
      .cookie('token', token, {
        maxAge: 86400000,
        httpOnly: true,
        sameSite: 'strict',
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
    console.error('Verify OTP Error:', err);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};

