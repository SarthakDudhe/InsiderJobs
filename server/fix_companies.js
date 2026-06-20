import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI + '/Job-Portal';

async function fixCompanies() {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB:", uri);

    const result = await mongoose.connection.collection('companies').updateMany(
        { isVerified: true, isEmailVerified: false },
        { $set: { isEmailVerified: true } }
    );
    
    console.log(`Matched ${result.matchedCount} companies and updated ${result.modifiedCount} companies.`);

    process.exit(0);
}

fixCompanies();
