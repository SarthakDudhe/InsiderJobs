import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    resume:{type:String,default:""},
    resumeText:{type:String,default:""},
    image:{type:String,default:""},
    skills:{type:[String],default:[]},
    experience:[{
        role:{type:String,default:""},
        company:{type:String,default:""},
        duration:{type:String,default:""}
    }],
    education:[{
        degree:{type:String,default:""},
        school:{type:String,default:""},
        year:{type:String,default:""}
    }],
    links:{
        github:{type:String,default:""},
        linkedin:{type:String,default:""},
        portfolio:{type:String,default:""}
    }
})

const User = mongoose.model("User",userSchema)

export default User;