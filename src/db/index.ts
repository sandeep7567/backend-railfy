import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}`);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log(`\n MongoDB connected !! DB HOST: ${connection.host}`);
        });

        connection.on("error", (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit(1);
        });
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

export default connectDB