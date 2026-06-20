import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI + '/Job-Portal';

async function checkUser() {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB:", uri);

    const email = "sarthakdudhe79@gmail.com";
    const user = await mongoose.connection.collection('users').findOne({ email });
    
    if (user) {
        console.log("Found user:");
        console.log("ID:", user._id);
        console.log("ID Type:", typeof user._id);
        console.log("Is ObjectId?", user._id instanceof mongoose.Types.ObjectId);
    } else {
        console.log("User not found");
    }

    process.exit(0);
}

checkUser();
