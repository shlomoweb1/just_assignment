import Clients from "../../models/clients";
import Trunsactions from '../../models/transactions';
import mocks from '../../../../assignment/data.json';
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../utils/dbConnect'

export default async function handler( _req: NextApiRequest, res: NextApiResponse ) {

    const handleError = (err: any) => res.status(400).json({ success: false, err: {...err, stack: err.stack} })
    // don't allow seed in production
    if(process.env.NODE_ENV !== "development") return handleError(new Error('Only allowed in dev env. your are on '+process.env.NODE_ENV));
    try {       
        await db();
        try {
                Promise.all([
                    Clients.deleteMany({}),
                    Trunsactions.deleteMany({}),
                ]).then(()=>{
                    return Promise.all(mocks.map(mock=>new Promise((resolve, reject)=>{
                        Clients.create({
                            "first_name": mock.first_name,
                            "last_name": mock.last_name,
                            "email": mock.email,
                            "gender": mock.gender,
                            "country": mock.country,
                            "city": mock.city,
                            "street": mock.street,
                            "phone": mock.phone,
                        }).then(client=>{
                            Trunsactions.create({
                                "client_id": client._id,
                                "total_price": mock.total_price,
                                "currency": mock.currency,
                                "cerdit_card_type": mock.cerdit_card_type,
                                "cerdit_card_number": mock.cerdit_card_number,
                            }).then(()=>resolve(null)).catch(e=>reject(e))
                        }).catch(e=>reject(e))
                    }))).then((clients)=>{
                        res.status(200).json({ success: true, amount: clients.length })
                    }).catch(e=>handleError(e))
                }).catch(e=>handleError(e))
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        handleError(error)
    }

}
