import mongoose from 'mongoose';

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb+srv://steven:1111@cluster0.ryvps.mongodb.net/search-app", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

connectToDatabase();

export default mongoose;