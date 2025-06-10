import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import sendEmail from "../utils/send-email.js"; // Adjust import if needed
import { User } from "../models/user.model.js"; // Assuming you have User model to fetch user info

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;

    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }

    // check if the user has already applied for the job
    const existingAppication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingAppication) {
      return res.status(400).json({
        message: "You have already applied for this jobs",
        success: false,
      });
    }

    // check if the jobs exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // application array created inside job.model.js
    job.applications.push(newApplication._id);
    await job.save();

    // Fetch user email and fullname for email notification
    const user = await User.findById(userId);
    if (user?.email) {
      await sendEmail(
        user.email,
        "🎯 Application Received - " + job.title,
        `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #4CAF50;">Hi ${user.fullname},</h2>
          <p>🎉 You've successfully applied for the position of <strong style="color:#1976d2;">${job.title}</strong>.</p>
          <p>We truly appreciate your interest in this opportunity. Our team will review your profile and get back to you soon.</p>
          <p style="margin-top: 20px;">Stay tuned and good luck! 🍀</p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 14px; color: #777;">This is an automated confirmation from Job Portal.</p>
        </div>
        `
      );
    }

    return res.status(201).json({
      message: "Job applied successfully & email sent..",
      success: true,
    });
  } catch (error) {
    console.log(error);
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
    // console.log(job);

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
        // message: "status is required",
        message: "Application ID is required.",
        success: false,
      });
    }

    // find the application by application id
    // const application = await Application.findOne({ _id: applicationId });
    // if (!application) {
    //   return res.status(404).json({
    //     message: "Application not found.",
    //     success: false,
    //   });
    // }
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

    // if (user?.email) {
    //   await sendEmail(
    //     user.email,
    //     "📢 Application Status Updated",
    //     `<p>Hi ${user.fullname},</p>
    //      <p>Your application status for the job <strong>"${jobTitle}"</strong> has been updated to:</p>
    //      <h3 style="color: #1976d2;">${application.status.toUpperCase()}</h3>
    //      <p>Thank you for your interest in this position. We will keep you updated.</p>
    //      <br/>
    //      <p>Best regards,<br/>Job Portal Team</p>`
    //   );
    // }

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
