import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'));
        
        if (!process.env.MONGODB_URI) {
            console.error("Database connection error: MONGODB_URI environment variable is missing.");
            return;
        }

        await mongoose.connect(`${process.env.MONGODB_URI}/Job-Portal`);
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
}

export default connectDB;


