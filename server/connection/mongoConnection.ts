import mongoose from 'mongoose';

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.DB as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

export default connectToMongoDB;