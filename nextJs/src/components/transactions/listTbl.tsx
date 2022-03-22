import { IgetResponse as ItransactionResponse } from '../../pages/api/transaction';
import style from './listTbl.module.scss';
import { useState } from 'react';
console.log(style);
const TransactionsTable: React.FunctionComponent<ItransactionResponse["payload"] & { onEdit: (item: any) => Promise<void>; onDelete: (_id: string) => void }> = ({ items: transactions, onDelete, onEdit }) => {
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
                {transactions.map((transaction, index) => {
                    const [edit, setEdit] = useState(false);
                    const [save, setSave] = useState(false);
                    const clientName = [transaction.client_id.first_name, transaction.client_id.last_name].join(" ");
                    let editData = { ...transaction }
                    return (
                        <tr key={index + "_" + transaction._id}>
                            <td data-name="ClientName">
                                {

                                    edit ? (
                                        <>
                                            <input type="text" value={clientName} disabled />
                                        </>
                                    ) : (clientName)
                                }
                            </td>
                            <td data-name="cc_type">
                                {

                                    edit ? (
                                        <>
                                            <input type="text" value={editData.cerdit_card_type} />
                                        </>
                                    ) : (transaction.cerdit_card_type)
                                }
                            </td>
                            <td data-name="cc_num">
                                {

                                    edit ? (
                                        <>
                                            <input type="text" value={editData.cerdit_card_number} />
                                        </>
                                    ) : (transaction.cerdit_card_number)
                                }
                            </td>
                            <td data-name="currency">
                                {

                                    edit ? (
                                        <>
                                            <input type="text" value={editData.currency} />
                                        </>
                                    ) : (transaction.currency)
                                }
                            </td>
                            <td data-name="total">
                                {

                                    edit ? (
                                        <>
                                            <input type="text" value={editData.total_price} />
                                        </>
                                    ) : (transaction.total_price)
                                }
                            </td>
                            <td data-name="tools">
                                {
                                    edit ? (<>
                                        <button onClick={
                                            (e) => {
                                                const el = (e.target as HTMLButtonElement);
                                                if(el.getAttribute("disabled")) return alert("We are saving the data, plese wait")
                                                el.classList.add("disabled");
                                                el.setAttribute("disabled", "true");
                                                setSave(true)
                                                onEdit(editData)
                                                    .catch(e=>alert(e.message || "We had a problom Huston :("))
                                                    .finally(()=>{
                                                        el.classList.remove("disabled");
                                                        el.removeAttribute("disabled");  
                                                        setEdit(false);
                                                        setSave(false);
                                                    })
                                            }
                                        }>{save ? (<div className="loader">Saving...</div>) : "Save"}</button>
                                        <button onClick={()=>{
                                            editData = { ...transaction };
                                            setEdit(false);
                                        }}>Reset</button>
                                    </>) : (<>
                                        <button onClick={()=>{
                                            setEdit(true);
                                        }}>Edit</button>
                                        <button onClick={() => {
                                            const ask = window.confirm("Are you sure you want to delete?")
                                            if (ask) onDelete(transaction._id as any)
                                        }}>Delete</button>
                                    </>)
                                }
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default TransactionsTable