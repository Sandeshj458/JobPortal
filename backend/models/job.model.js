import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    education: {
      type: [String],
      required: true,
    },
    screeningType: {
      type: String,
      enum: ["ATS", "Manual"],
      required: true,
    },
    keywords: [
      {
        type: String,
      },
    ],

    salary: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiredDate: {
      type: Date,
      required: true,
    },

    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to remove `keywords` if screeningType is Manual
jobSchema.pre("save", function (next) {
  if (this.screeningType === "Manual") {
    this.keywords = undefined;
  }
  next();
});


export const Job = mongoose.model("Job", jobSchema);
