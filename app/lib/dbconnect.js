import mongoose from "mongoose";

const dbconnect = async () => {
    if (mongoose.connections[0].readyState) return;

    await mongoose.connect(process.env.MONGODB_URI);
}

export default dbconnect;
