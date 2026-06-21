import mongoose from "mongoose";


const companySchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    image:{type:String,required:true},
    password:{type:String,required:true},
    recruiterName:{type:String,default:''},
    linkedin:{type:String,default:''},
    lastActivity:{type:Date,default:Date.now},
    isVerified:{type:Boolean,default:false},
    emailVerificationToken: {type:String},
    emailVerificationExpires: {type:Date},
    isEmailVerified: {type:Boolean,default:false}
})

const Company = mongoose.model("Company",companySchema)

export default Company;