import mongoose from "mongoose";

const DeletionLogSchema = new mongoose.Schema({

  email: { type: String, required: true },
  role: { type: String, required: true },
  deletedAt: { type: Date, default: Date.now },
  details: {
    jobs: { type: Object, default: {} },
    applications: { type: Object, default: {} },
    companies: { type: Object, default: {} },
    
  },
});

export const DeletionLog = mongoose.model("DeletionLog", DeletionLogSchema);
