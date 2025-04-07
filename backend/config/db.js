import mongoose from 'mongoose';


// export const connectMongoDB = async () => {
//     mongoose.connect(process.env.DB_URI)
//     .then((data) => {
//         console.log(`MongoDB connected with server ${data.connection.host}`);


//     })
// }

export const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

