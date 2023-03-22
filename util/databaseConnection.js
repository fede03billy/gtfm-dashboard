// Import mongoose and initialaize connection to mongoDB using mongoose.connect() and environment variables
import mongoose from 'mongoose';

export default async function databaseConnection() {
  // check if we have already connected to the database
  if (mongoose.connections[0].readyState) {
    // use current db connection
    return;
  }
  mongoose
    .connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));
}
