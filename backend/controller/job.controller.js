import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js"; // Import User model
import sendEmail from "../utils/send-email.js"; // Import email utility

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      experience,
      location,
      jobType,
      position,
      companyId,
      expiredDate,
      education,
      screeningType,
      keywords,
    } = req.body;

    const userId = req.id;

    // ✅ Validate required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experience ||
      !location ||
      !jobType ||
      !position ||
      !companyId ||
      !expiredDate ||
      !education ||
      !screeningType ||
      (screeningType === "ATS" && !keywords)
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    // ✅ Create job in DB
    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((r) => r.trim()),
      salary,
      experienceLevel: Number(experience),
      location,
      jobType,
      position: Number(position),
      company: companyId,
      expiredDate: new Date(expiredDate),
      created_by: userId,
      education,
      screeningType,
      keywords:
        screeningType === "ATS"
          ? Array.isArray(keywords)
            ? keywords.map((k) => k.trim().toLowerCase())
            : keywords.split(",").map((k) => k.trim().toLowerCase())
          : [],
    });

    // ✅ Send email to matching jobseekers
    const jobseekers = await User.find({ role: "jobseeker" });

    for (const user of jobseekers) {
  
      const userSkills =
        user?.profile?.skills?.map((s) => s.toLowerCase()) || [];

      const matchByTitle =
        user?.profile?.bio && title
          ? title.toLowerCase().includes(user.profile.bio.toLowerCase()) ||
            user.profile.bio.toLowerCase().includes(title.toLowerCase())
          : false;

      const jobEduList = Array.isArray(education) ? education : [education];
      const userEduList = Array.isArray(user?.profile?.education)
        ? user.profile.education
        : [];

      const matchByEducation = jobEduList.some((jobEdu) =>
        userEduList.some((userEdu) =>
          userEdu.toLowerCase().includes(jobEdu.toLowerCase())
        )
      );

      const jobKeywords = Array.isArray(job.keywords)
        ? job.keywords.map((k) => k.toLowerCase())
        : [];

      const matchedKeywords = jobKeywords.filter((kw) =>
        userSkills.includes(kw)
      );
      const keywordMatch = matchedKeywords.length >= 1;

      const userExp = Number(user?.profile?.experience);
      const jobExp = Number(job.experienceLevel);

      const matchByExperience =
        !isNaN(userExp) && !isNaN(jobExp) && userExp >= jobExp;

      if (
        matchByTitle ||
        matchByEducation ||
        (keywordMatch && matchByExperience)
      ) {
        const emailHtml = `
<table style="width: 100%; max-width: 600px; margin: auto; font-family: Arial, sans-serif; border-collapse: collapse; border: 1px solid #e0e0e0;">
  <tr style="background-color: #0B5ED7; color: white;">
    <td style="padding: 20px; text-align: center; font-size: 20px;">
      🎉 A New Job Opportunity Just for You!
    </td>
  </tr>

  <tr>
    <td style="padding: 20px; background-color: #f9f9f9;">
      <p style="font-size: 16px; color: #333;">
        Hello <strong>${user.fullname || "there"}</strong>,
      </p>

      <p style="font-size: 16px; color: #333;">
        A new job that matches your profile has been posted. Here are the details:
      </p>

      <ul style="padding-left: 20px; font-size: 15px; color: #444;">
        <li><strong>📌 Title:</strong> ${title}</li>
        <li><strong>📍 Location:</strong> ${location}</li>
        <li><strong>💼 Job Type:</strong> ${jobType}</li>
       <li><strong>🧠 Skills Required:</strong> ${
         requirements || "Not specified"
       }</li>
        <li><strong>🎓 Education Required:</strong> ${education}</li>
        <li><strong>💰 Salary:</strong> ${salary}</li>
        <li><strong>📅 Expiry Date:</strong> ${new Date(
          expiredDate
        ).toLocaleDateString()}</li>
      </ul>

      <p style="margin-top: 20px; font-size: 16px;">
        Don't miss out — apply now while the opportunity is fresh!
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://jobportal-0nuc.onrender.com/" target="_blank" style="background-color: #0B5ED7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          🔗 View & Apply Now
        </a>
      </div>

      <p style="font-size: 14px; color: #888; text-align: center;">
        — Job Portal Team
      </p>
    </td>
  </tr>
</table>
`;
        await sendEmail(user.email, `Job Match Found: ${title}`, emailHtml);

      }
    }

    return res.status(201).json({
      message: "New job created and notifications sent to matching jobseekers.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    let jobs = await Job.find(query)
      .populate("company")
      .populate({
        path: "created_by",
        select: "access",
        match: { access: true }, // ✅ Only verified recruiters
      })
      .sort({ createdAt: -1 });

    // ✅ Remove jobs with unverified recruiter
    jobs = jobs.filter((job) => job.created_by);

    // ✅ Optional: send message if no jobs found
    if (jobs.length === 0) {
      return res.status(200).json({
        message: "No jobs found.",
        jobs: [],
        success: true,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("getAllJobs error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


// How many job are created by admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId || jobId === "undefined") {
      return res.status(400).json({
        error: "Job ID is required",
        success: false,
      });
    }

    const job = await Job.findById(jobId)
      .populate("applications")
      .populate({
        path: "created_by",
        select: "access",
      });

    // ✅ If job doesn't exist or recruiter is unverified
    if (!job || !job.created_by || job.created_by.access === false) {
      return res.status(404).json({
        message: "Job not found or recruiter is not verified.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("getJobById error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const filterJobs = async (req, res) => {
  try {
    const { searchedQuery } = req.query;
    const filter = {};

    if (searchedQuery) {
      if (
        searchedQuery.includes("Lakhs") ||
        searchedQuery.includes("K") ||
        searchedQuery.includes("Cr")
      ) {
        filter.salary = searchedQuery; // Exact match
      } else {
        filter.$or = [
          { location: { $regex: searchedQuery, $options: "i" } },
          { industry: { $regex: searchedQuery, $options: "i" } },
        ];
      }
    }

    let jobs = await Job.find(filter)
      .populate("company")
      .populate({
        path: "created_by",
        select: "access",
        match: { access: true }, // ✅ Only include jobs by verified recruiters
      });

    // ✅ Remove jobs where recruiter is unverified
    jobs = jobs.filter((job) => job.created_by);

    // ✅ Optional: message for no matches
    if (jobs.length === 0) {
      return res.status(200).json({
        message: "No matching jobs found.",
        data: [],
        success: true,
      });
    }

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error filtering jobs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Job not found" });
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting job", error: err });
  }
};

export const updateJobById = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(id, updatedData, {
      new: true, // return the updated document
      runValidators: true,
    });

    if (!updatedJob) return res.status(404).json({ message: "Job not found" });

    res.json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error updating job", error: err });
  }
};
