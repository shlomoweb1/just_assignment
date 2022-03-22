import { IgetResponse as IclientResponse } from "../pages/api/clients";
import { IgetResponse as ItransactionsResponse } from "../pages/api/transaction";
import axios from "../utils/axios";

export const clientAPI = {
    get: ({filters}:{filters?: {page?: number, limit?: number, time?: number}}) => {
        filters = filters || {};
        filters.time = filters.time || +new Date();
        return axios.get<IclientResponse>('/api/clients', {params: filters})
    }
}

export const transactionAPI = {
    get: ({filters}:{filters?: {page?: number, limit?: number, time?: number}}) => {
        filters = filters || {};
        filters.time = filters.time || +new Date();
        return axios.get<ItransactionsResponse>('/api/transaction', {params: filters})
    }
}