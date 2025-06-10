import { Job } from "../models/job.model.js";
// import { Op } from 'sequelize';

// for Admin to post the job
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
    } = req.body;
    const userId = req.id;

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
      !expiredDate
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((r) => r.trim()),
      salary, // keep as string
      experienceLevel: Number(experience), // convert experience to number
      location,
      jobType,
      position: Number(position), // ensure position is number
      company: companyId,
      expiredDate: new Date(expiredDate),
      created_by: userId,
    });
    return res.status(201).json({
      message: "New job creatd successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// for Student
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } }, // $options:"i" => 'i' is case sensitive
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({ path: "company" })
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

// for Student
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log("Received ID:", jobId);

    if (!jobId || jobId === "undefined") {
      return res.status(400).json({ 
        error: "Job ID is required" 
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
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

// export const filterJobs = async (req, res) => {
//   try {
//     const { searchedQuery } = req.query;
//     const whereCondition = {};

//     if (searchedQuery) {
//       if (
//         searchedQuery.includes('Lakhs') ||
//         searchedQuery.includes('K') ||
//         searchedQuery.includes('Cr')
//       ) {
//         whereCondition.salary = { [Op.eq]: searchedQuery }; // Exact salary match
//       } else {
//         whereCondition[Op.or] = [
//           { location: searchedQuery },
//           { industry: searchedQuery },
//         ];
//       }
//     }

//     const jobs = await Job.findAll({ where: whereCondition });

//     res.status(200).json({ success: true, data: jobs });
//   } catch (error) {
//     console.error('Error filtering jobs:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

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

    const jobs = await Job.find(filter).populate("company");

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
    res.status(500).json({ success: false, message: "Error deleting job", error: err });
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

    res.json({success: true, message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    res.status(500).json({success: false, message: "Error updating job", error: err });
  }
};
