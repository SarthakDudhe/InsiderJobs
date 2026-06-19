import mongoose from "mongoose";


const companySchema = new mongoose.Schema({
    name:{type:String,required:true},
     email:{type:String,required:true,unique:true},
    image:{type:String,required:true},
    password:{type:String,required:true},
    lastActivity:{type:Date,default:Date.now},
})

const Company = mongoose.model("Company",companySchema)

export default Company;