import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Database Connected'));
    
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is missing.");
    }

    await mongoose.connect(`${process.env.MONGODB_URI}/Job-Portal`, {
        serverSelectionTimeoutMS: 5000
    });
}

export default connectDB;


