import mongoose from "mongoose";
import db from '../utils/dbConnect';
if(typeof window === "undefined") db();

export const CollectionClientName = "Client"

export interface Iclient {
    "first_name": string;
    "last_name": string;
    "email": string;
    "gender": string;
    "country": string;
    "city": string;
    "street": string;
    "phone": string;
    _deleted?: {
        date: Date;
    }
}

const clientSchema = new mongoose.Schema<Iclient>({
    "first_name": { type: String, required: true },
    "last_name": { type: String, required: true },
    "email": { type: String, required: true, unique: true },
    "gender": { type: String, required: true },
    "country": { type: String, required: true },
    "city": { type: String, required: true },
    "street": { type: String, required: true },
    "phone": { type: String, required: true },
    _deleted: {
        type: {
            date: Date
        },
        required: false
    }
});

export default mongoose.models[CollectionClientName] as mongoose.Model<Iclient>|| mongoose.model<Iclient>(CollectionClientName, clientSchema);