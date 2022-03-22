import mongoose from "mongoose";
import { CollectionClientName } from "./clients";
import db from '../utils/dbConnect';
if(typeof window === "undefined") db();

const CollectionTransactionsName = "Transactions";

export interface Itransactions {
    "client_id": mongoose.ObjectId;
    "currency": string;
    "cerdit_card_type": string;
    "cerdit_card_number": string;
    "total_price": number;
}

const transactionsSchema = new mongoose.Schema<Itransactions>({
    client_id: {
        type: mongoose.Types.ObjectId,
        ref: CollectionClientName
    },
    total_price: { type: Number, required: true },
    currency: { type: String, required: true },
    cerdit_card_type: { type: String, required: true },
    cerdit_card_number: { type: String, required: true }
});

export default mongoose.models[CollectionTransactionsName] as mongoose.Model<Itransactions>|| mongoose.model<Itransactions>(CollectionTransactionsName, transactionsSchema);