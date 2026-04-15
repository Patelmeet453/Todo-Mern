import mongoose from "mongoose";

const ConnectionDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected Successfully - ${conn.connection.host}`)
  } catch (error) {
    console.log("ConnectionDB error",error);
    process.exit(1);
  }
}

export default ConnectionDB;