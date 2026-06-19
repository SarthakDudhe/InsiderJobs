import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    location:{type:String,required:true},
    category:{type:String,required:true},
    level:{type:String,required:true},
    salary:{type:Number,required:true},
    date:{type:Number,required:true},
    visible:{type:Boolean,default:true},
    companyId:{type:mongoose.Schema.Types.ObjectId,ref: 'Company',required:true},
    reports: [
        {
            userId: { type: String },
            reason: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
})

const Job = mongoose.model("Job",JobSchema)

export default Job