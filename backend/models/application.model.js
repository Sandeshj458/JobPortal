import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // In Which company we Apply
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // Who applies to JOB
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    atsScore: { type: Number,  default: 0, }, // ⭐ new
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);
