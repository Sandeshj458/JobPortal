import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
   
    // In Which company we Apply
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',  
        required:true
    },

    // Who applies to JOB
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',  
        required:true
    },

    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
    }
},
    {
        timestamps:true
    }
);

export const Application = mongoose.model("Application", applicationSchema);
