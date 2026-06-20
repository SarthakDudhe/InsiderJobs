import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/User.js';

const uri = process.env.MONGODB_URI + '/Job-Portal';

async function checkUser() {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB:", uri);

    const email = "sarthakdudhe79@gmail.com";
    const user = await User.findOne({ email });
    
    if (user) {
        console.log("Found user via Mongoose:");
        console.log("ID:", user._id);
        console.log("ID Type:", typeof user._id);
        console.log("Is String Object?", user._id instanceof String);
        console.log("Constructor:", user._id.constructor.name);
    } else {
        console.log("User not found");
    }

    process.exit(0);
}

checkUser();
