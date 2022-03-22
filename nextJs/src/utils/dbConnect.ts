/* This is a database connection function*/
// https://ndpniraj.com/blogs/how-to-use-mongodb-with-mongoose-inside-next-js
import {Mongoose} from 'mongoose';
import { connect } from 'mongoose';
const MONGODB_URI = process.env.mongoUri as string;
declare global {
    var mongoose: {
        conn: Mongoose;
        promise: Promise<Mongoose>;
    };
}
// https://github.com/vercel/next.js/issues/5354#issuecomment-520305040
// a hack for development client skip this error
if (!MONGODB_URI && typeof window === 'undefined'){
    const err = new Error("Please define the MONGODB_URI environment variable inside .env.local or docker-compose.yml");
    throw err;
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null as any, promise: null as any}
}

async function dbConnect() {
    if (cached.conn) { return cached.conn; }

    if (!cached.promise) { 
        const opts = { bufferCommands: false };
        cached.promise = connect(MONGODB_URI, opts).then((conn) => {
            console.log("mongo db connection established")
            console.log(__dirname)
            return conn
        });
    }  
    cached.conn = await cached.promise; 
    return cached.conn; 
}

module.exports = dbConnect;





export default dbConnect
