import Clients from "../../../models/clients";
import type { NextApiRequest, NextApiResponse } from 'next'
import {useRouter} from 'next/router'
import mongoose from 'mongoose';


export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
    const { method } = req;
    const { query } = useRouter();

    if(mongoose.isValidObjectId(query._id)) return res.status(400).json({ success: false, error: "Invalid Id" });

    // never expose internal db error
    // @TODO friendly message if it is field validation
    const handleError = (_err: any) => res.status(400).json({ success: false })

    switch(method){
        case "PUT":
            try {
                const clients = await Clients.findOneAndUpdate({_id: query._id}, req.body);
                return res.status(200).json({success: true, payload: clients})
            } catch (error) {
                // @TODO log error
                return handleError(error);
            }
        case "DELETE":
            try {
                // mongose validate the data so we are safe
                const newClient = await Clients.findOneAndUpdate({_id: query._id}, {_deleted: {date: new Date()}});
                return res.status(200).json({success: true, payload: newClient})
            } catch (error) {
                // @TODO log error
                return handleError(error);
            }
		default:
			res.setHeader("Allow", ["PUT", "DELETE"]);
			return res
				.status(405)
				.json({ success: false, error: `Method ${method} Not Allowed`});
    }
}
