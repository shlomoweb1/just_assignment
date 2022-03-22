import Transactions, { Itransactions } from "../../../models/transactions";
import Client, { Iclient } from "../../../models/clients";
import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose';
import {Document, Types} from 'mongoose';

export interface IgetResponse{
    success: boolean;
    payload: {
        total: number;
        page: number;
        pages: number;
        count: number;
        items: (Document<unknown, any, Itransactions> & Itransactions & {
            _id: Types.ObjectId;
            client_id: Iclient
        })[];
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    // never expose internal db error
    // @TODO friendly message if it is field validation
    const handleError = (_err: any) => {
        console.log(_err);
        res.status(400).json({ success: false })
    }

    switch (method) {
        case "GET":
            try {
                const page = parseInt(req.query.page as string || "1") - 1;
                const limit = parseInt(req.query.limit as string || "20");
                const query = {};

                const transactions = await Transactions.find(query).populate("client_id").limit(limit).skip((page) * limit).clone();
                return Transactions.countDocuments(query, undefined, (err, total) => {
                    if (err) return res.status(500).json({ success: false, message: "Error in DB" });
                    const payload : IgetResponse["payload"] = {
                        total,
                        page: page+1,
                        pages: Math.ceil(total / limit),
                        count: transactions.length,
                        items: transactions as any
                    }
                    return res.status(200).json({
                        success: true, payload
                    })
                }).clone()
            } catch (error) {
                // @TODO log error
                return handleError(error);
            }
        case "POST":
            try {
                const { clientId, total_price, currency, cc_type, cc_num } = req.body;
                const err = [];
                if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) {
                    err.push(new Error("Invalid client Id provided"));
                } else {
                    try {
                        const client = await Client.findOne({ _id: clientId });
                        if (!client || !clientId) err.push(new Error("Unkown client"));
                    } catch (error) {
                        return handleError(error);
                    }
                }
                if (typeof currency == "undefined") err.push("Please provide currency");
                if (typeof total_price == "undefined") err.push("Please provide total for trunsaction");
                if (typeof cc_type == "undefined") err.push("Please provide Credit Card type for trunsaction");
                if (typeof cc_num == "undefined") err.push("Please provide Credit Card number for trunsaction");

                if (err.length) return res.status(400).json({ success: false, message: "form incompletes", errors: err });

                const transaction = await Transactions.create({
                    client_id: new mongoose.Types.ObjectId(clientId),
                    total_price: parseFloat(parseFloat(total_price).toFixed(2)),
                    currency,
                    cerdit_card_type: cc_type,
                    cerdit_card_number: cc_num
                });

                return res.status(200).json({ success: true, payload: transaction._id })
            } catch (error) {
                // @TODO log error
                return handleError(error);
            }
        case "PUT":
            try {
                const { transactionId, clientId, total_price, currency, cc_type, cc_num } = req.body;
                const err = [];
                if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
                    err.push("Missing require param `transactionId`");
                } else {
                    const transaction = await Transactions.findOne({ _id: transactionId });
                    if (!transaction || !transaction._id) err.push(`No transaction with ${transactionId}`);
                }
                if (err.length) return res.status(400).json({ success: false, message: "form incompletes", errors: err });

                const errUpdate = [];
                let update: mongoose.FilterQuery<typeof Transactions> = {
                    $set: {}
                };
                if (typeof clientId !== "undefined") {
                    if (!mongoose.Types.ObjectId.isValid(clientId)) {
                        errUpdate.push("Invalid client id");
                    } else {
                        const client = await Client.findOne({ _id: clientId });
                        if (!client || !clientId) {
                            errUpdate.push(new Error("Unkown client"));
                        } else {
                            update.$set["client_id"] = client._id;
                        }
                    }
                }

                if (typeof total_price !== "undefined") update.$set["total_price"] = parseFloat(parseFloat(total_price).toFixed(2));
                if (typeof currency !== "undefined") update.$set["currency"] = currency;
                if (typeof cc_type !== "undefined") update.$set["cerdit_card_type"] = cc_type;
                if (typeof cc_num !== "undefined") update.$set["cerdit_card_number"] = cc_num;

                if (!Object.keys(update.$set).length) return res.status(400).json({ success: false, message: "There is nothing to update" });

                return Transactions.findOneAndUpdate({ _id: transactionId }, update, {}, (err, result) => {
                    if (err) return res.status(500);
                    return res.status(200);
                });
            } catch (error) {
                // @TODO log error
                return handleError(error);
            }
        case "DELETE":
            const { transactionId } = req.body;
            if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
                return res.status(400).json({ success: false, message: "Invalid Id format" })
            }
            return Transactions.deleteOne({ _id: transactionId }, undefined, (err) => {
                if (err) return res.status(500);
                return res.status(200);
            })
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            return res
                .status(405)
                .json({ success: false, error: `Method ${method} Not Allowed` });
    }
}
