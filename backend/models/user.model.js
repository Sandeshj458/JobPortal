import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    
    role: {
      type: String,
      enum: ["jobseeker", "recruiter"],
      required: true,
    },
    access: {
      type: Boolean,
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, // URL to resume file
      resumeOriginalName: { type: String },
      experience: { type: Number }, 
      education: {
      type: [String],
      required: true,
    },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);


// Remove skills field if role is recruiter before saving
userSchema.pre("save", function (next) {
  if (this.role === "recruiter" && this.profile?.skills) {
    this.profile.skills = undefined;
  }
  next();
});

export const User = mongoose.model("User", userSchema);
