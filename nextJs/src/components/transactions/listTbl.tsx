import { IgetResponse as ItransactionResponse } from '../../pages/api/transaction';
import style from './listTbl.module.scss';
import { Document, Types } from 'mongoose'
import { Itransactions } from '../../models/transactions';
import { Iclient } from '../../models/clients';
import Row from './listRow';

export type Itransaction = Document<unknown, any, Itransactions> & Itransactions & {
    _id: Types.ObjectId;
    client_id: Iclient;
}


const TransactionsTable: React.FC<ItransactionResponse["payload"] & { onEdit: (item: any) => Promise<any>; onDelete: (_id: Itransaction["_id"]) => void }> = ({ items: transactions, onDelete, onEdit }) => {
    return (
        <table className={style.transaction}>
            <thead>
                <tr>
                    <th>Client</th>
                    <th>CC type</th>
                    <th>CC number</th>
                    <th>currency</th>
                    <th>total</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction) => {
                    return (<Row data={transaction} onEdit={onEdit} onDelete={onDelete} key={transaction._id.toString()} />)
                })}
            </tbody>
        </table>
    )
}

export default TransactionsTable