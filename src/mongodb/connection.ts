// Importing required modules
import mongoose from 'mongoose';

// Define MongoDB connection URI
const mongoURI: string = Bun.env.MONGO_URI || 'mongodb://localhost:27017/olimpo-gym';


// Connect to MongoDB
try {
    await mongoose.connect(mongoURI);
} catch (error) {
    // Log error and exit
    console.error('🦊 Error connecting to MongoDB:', error);
    process.exit(1);
}

console.log('🦊 MongoDB is running at', mongoURI);