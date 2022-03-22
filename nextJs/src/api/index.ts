import { Itransaction } from "../components/transactions/listTbl";
import { IgetResponse as IclientResponse } from "../pages/api/clients";
import { IgetResponse as ItransactionsResponse } from "../pages/api/transaction";
import axios from "../utils/axios";

const urls = {
    transaction: "/api/transaction",
    clients: "/api/clients"
}

export const clientAPI = {
    get: ({ filters }: { filters?: { page?: number, limit?: number, time?: number, q?:string } }) => {
        filters = filters || {};
        filters.time = filters.time || +new Date();
        return axios.get<IclientResponse>(urls.clients, { params: filters })
    }
}

export const transactionAPI = {
    get: ({ filters }: { filters?: { page?: number, limit?: number, time?: number } }) => {
        filters = filters || {};
        filters.time = filters.time || +new Date();
        return axios.get<ItransactionsResponse>(urls.transaction, { params: filters })
    },
    put: (data: Itransaction) => {
        return axios.put<null>(urls.transaction, {
                transactionId: data._id, 
                clientId: (data.client_id as any)._id, 
                total_price: data.total_price, 
                currency: data.currency, 
                cc_type: data.cerdit_card_type, 
                cc_num: data.cerdit_card_number  
        })
    },
    delete: (_id: Itransaction["_id"]) => {
        return axios.delete<void>(urls.transaction, {data: {transactionId: _id}})
    },
    post: (data: {
        client_id: any;
        cc_type: any;
        cc_number: any;
        currency: any;
        total: any;
    }) => {
        return axios.post<{ success: true, payload: string }>(urls.transaction, {
            clientId: data.client_id, 
            total_price: data.total, 
            currency: data.currency, 
            cc_type: data.cc_type, 
            cc_num: data.cc_number 
        })
    }
}