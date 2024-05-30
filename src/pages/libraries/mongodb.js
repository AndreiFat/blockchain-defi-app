import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, clientOptions).then((mongoose) => {
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

function handleExit(signal) {
    console.log(`Received ${signal}. Closing MongoDB connection.`);
    mongoose.disconnect()
        .then(() => {
            console.log('MongoDB connection closed.');
            process.exit(0);
        })
        .catch(err => {
            console.error('Error closing MongoDB connection', err);
            process.exit(1);
        });
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

export default connectToDatabase;

