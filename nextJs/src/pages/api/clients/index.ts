import Clients, { Iclient } from "../../../models/clients";
import type { NextApiRequest, NextApiResponse } from 'next';

import {Document, Types} from 'mongoose'

export interface IgetResponse{
    success: boolean;
    payload: {
        total: number;
        page: number;
        pages: number;
        count: number;
        items: (Document<unknown, any, Iclient> & Iclient & {
            _id: Types.ObjectId;
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
                const query = { "_deleted.date": { $exists: false } };

                return Clients.count(query, (err, totalClients) => {
                    if (err) return res.status(500).json({ success: false, message: "Error in DB" });

                    Clients.find(query).limit(limit).skip((page) * limit).then(clients => {
                        const payload : IgetResponse["payload"]= {
                            total: totalClients,
                            page,
                            pages: Math.ceil(totalClients / limit),
                            count: clients.length,
                            items: clients
                        }
                        return res.status(200).json({
                            success: true, payload
                        })
                    }).catch(handleError);
                }).clone();

            } catch (error) {
                // @TODO log error
                return handleError(error);
            }
        case "POST":
            try {
                // mongose validate the data so we are safe
                const newClient = await Clients.create(req.body);
                return res.status(200).json({ success: true, payload: newClient })
            } catch (error) {
                // @TODO log error
                return handleError(error);
            }
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            return res
                .status(405)
                .json({ success: false, error: `Method ${method} Not Allowed` });
    }
}
