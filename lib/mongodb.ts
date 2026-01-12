import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI!

if(!MONGODB_URI){
    throw new Error('MONGODB_URI is not defined in .env.local')
}

// implementing connection caching
let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = { conn: null, promise: null }
}

const connectDB = async () => {
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
export default connectDB;