import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

async function checkUsers() {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const users = await mongoose.connection.collection('users').find({}).toArray();
    console.log("All users:");
    users.forEach(u => console.log(u.email, u._id, typeof u._id, u._id instanceof mongoose.Types.ObjectId));

    process.exit(0);
}

checkUsers();
