import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import sendEmail from "../utils/send-email.js"; // Adjust import if needed
import { User } from "../models/user.model.js"; // Assuming you have User model to fetch user info
import axios from "axios";
import textract from "textract";
import dotenv from "dotenv";
dotenv.config({});

// 🧠 Helper: extract plain text from PDF resume
const getResumeText = async (resumeUrl) => {
  const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
  const pdfBuffer = Buffer.from(response.data); // ensure it's a proper Node.js buffer

  return new Promise((resolve, reject) => {
    textract.fromBufferWithMime("application/pdf", pdfBuffer, (err, text) => {
      if (err) {
        console.error("Textract error:", err);
        return reject("Failed to extract resume text.");
      }
      resolve(text);
    });
  });
};

// 🧠 Helper: calculate ATS score by matching job keywords with resume content
const calculateATSScore = (resumeText, jobKeywords = []) => {
  if (jobKeywords.length === 0) return 0;
  let matchCount = 0;
  for (let keyword of jobKeywords) {
    if (resumeText.toLowerCase().includes(keyword.toLowerCase())) {
      matchCount++;
    }
  }
  return Math.floor((matchCount / jobKeywords.length) * 100); // return score out of 100
};

export const applyJob = async (req, res) => {
  try {
    const userId = req.id; // get current user ID from auth middleware
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }

    // ❌ Prevent duplicate application
    const existingApp = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApp) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    // ✅ Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // ✅ Get applicant
    const applicant = await User.findById(userId);
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found",
        success: false,
      });
    }

    // ✅ Extract resume & keywords
    const resumeUrl = applicant?.profile?.resume;
    const jobKeywords = job?.keywords || [];

    // ✅ Calculate ATS score
    let atsScore = 0;
    if (resumeUrl && job.screeningType === "ATS") {
      const resumeText = await getResumeText(resumeUrl); // extract text
      atsScore = calculateATSScore(resumeText, jobKeywords); // compare with keywords
    }

    const applicationData = {
      job: jobId,
      applicant: userId,
    };
    if (job.screeningType === "ATS") {
      applicationData.atsScore = atsScore;
    }

    const newApplication = await Application.create(applicationData);

    

    job.applications.push(newApplication._id); // store in job list
    await job.save();

    // ✅ Email to Applicant
    if (applicant?.email) {
      await sendEmail(
        applicant.email,
        `🎯 Application Received - ${job.title}`,
        `
        <div style="max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#ffffff;">
          <div style="background-color:#4CAF50;color:#fff;padding:20px;text-align:center;">
            <h2 style="margin:0;">✅ Application Submitted Successfully</h2>
          </div>
          <div style="padding:20px;color:#333;">
            <p>Hi <strong>${applicant.fullname}</strong>,</p>
            <p>Thank you for applying for <strong>${
              job.title
            }</strong> at <strong>${
          job.companyName || "our organization"
        }</strong>.</p>
            <p>We’ll be in touch if you match our requirements.</p>
            <p>Location: ${job.location}<br/>Job Type: ${
          job.jobType
        }<br/>Salary: ${job.salary}</p>
            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.RENDER_DEPLOY_LINK}" style="background-color:#4CAF50;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;">
                Visit Job Portal
              </a>
            </div>
          </div>
          <div style="background-color:#f9f9f9;padding:15px;text-align:center;font-size:13px;color:#888;">
            This is an automated confirmation from Job Portal.
          </div>
        </div>
        `
      );
    }

    // ✅ Email to Recruiter
    const recruiter = await User.findById(job.created_by);
    if (recruiter?.email) {
      const resumeLink = applicant?.profile?.resume || "Not uploaded";
      const skills = applicant?.profile?.skills?.join(", ") || "Not specified";

      await sendEmail(
        recruiter.email,
        `📥 New Application for ${job.title}`,
        `
        <div style="max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#ffffff;">
          <div style="background-color:#0B5ED7;color:#fff;padding:20px;text-align:center;">
            <h2 style="margin:0;">📨 New Application Received</h2>
          </div>
          <div style="padding:20px;color:#333;">
            <p>Hello <strong>${recruiter.fullname}</strong>,</p>
            <p><strong>${applicant.fullname}</strong> applied for <strong>${
          job.title
        }</strong>.</p>
            <p>Email: ${applicant.email}<br/>Phone: ${
          applicant.phoneNumber || "N/A"
        }<br/>Skills: ${skills}</p>
            <p>Resume: ${
              resumeLink !== "Not uploaded"
                ? `<a href="${resumeLink}" target="_blank">View Resume</a>`
                : "Not uploaded"
            }</p>
            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.RENDER_DEPLOY_LINK}" style="background-color:#0B5ED7;color:#fff;padding:12px 24px;text-decoration:none;border-radius:5px;">
                🔍 View Application
              </a>
            </div>
          </div>
          <div style="background-color:#f0f0f0;padding:15px;text-align:center;font-size:13px;color:#888;">
            This is an automated message from Job Portal.
          </div>
        </div>
        `
      );
    }

    // ✅ Final response
    return res.status(201).json({
      message: "Job applied successfully. Emails sent.",
      atsScore,
      success: true,
    });
  } catch (error) {
    // console.log("Apply Job Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ created: -1 })
      .populate({
        path: "job",
        options: { sort: { created: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!application) {
      return res.status(404).json({
        message: "No Application",
        success: false,
      });
    }

    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Admin find how many user(applicants) apply for particular job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { created: -1 } },
      populate: {
        path: "applicant",
      },
    });
   
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// to update application status is either rejected or selected or pending
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!applicationId) {
      return res.status(400).json({
        message: "Application ID is required.",
        success: false,
      });
    }

    const application = await Application.findById(applicationId).populate(
      "applicant job"
    );
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Update the status
    application.status = status.toLowerCase();
    await application.save();

    // Send email notification about status update
    const user = application.applicant;
    const jobTitle = application.job?.title || "the job";


    if (user?.email) {
      await sendEmail(
        user.email,
        `📢 Status Update for "${jobTitle}"`,
        `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="color: #4CAF50; margin-bottom: 10px;">Hi ${
          user.fullname
        }, 👋</h2>
        <p style="font-size: 16px; color: #333;">
          We wanted to let you know that the status of your application for the position of 
          <strong style="color: #1976d2;">${jobTitle}</strong> has been updated.
        </p>

        <div style="margin: 20px 0; padding: 15px; background-color: #e3f2fd; border-left: 6px solid #2196f3;">
          <h3 style="margin: 0; color: #1976d2; text-transform: uppercase;">
            📌 ${application.status}
          </h3>
        </div>

        ${
          application.status === "selected"
            ? `<p style="font-size: 16px; color: #2e7d32;"><strong>🎉 Congratulations!</strong> You have been selected for the next step. Our team will contact you shortly.</p>`
            : application.status === "rejected"
            ? `<p style="font-size: 16px; color: #d32f2f;"><strong>😞 We're sorry!</strong> You have not been selected this time. Don't be discouraged — keep applying!</p>`
            : ""
        }

        <p style="margin-top: 30px; font-size: 15px; color: #555;">
          Thank you for using <strong>Job Portal</strong>. We're here to support you in your job search journey!
        </p>

        <hr style="margin: 30px 0;" />
        <p style="font-size: 13px; color: #999;">This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
    `
      );
    }

    return res.status(200).json({
      message: "Status updated successfully & email sent successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
