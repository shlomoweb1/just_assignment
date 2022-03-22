import { ChangeEvent, useEffect, useState } from "react";
import { Itransaction } from "./listTbl";

interface IpropsRow {
    data: Itransaction,
    onEdit: (data: Itransaction) => Promise<void>
    onDelete: (data: Itransaction["_id"]) => void
}
const Row: React.FC<IpropsRow> = ({ data, onEdit, onDelete }) => {
    const [state, setState] = useState({
        save: false,
        edit: false,
        editData: { ...data },
        data: {...data}
    });

    useEffect(()=>{
        if(data != state.data)
            setState({...state, data: {...data}})
    }, [])

    const clientName = [state.data.client_id.first_name, state.data.client_id.last_name].join(" ");

    const handleChange = (e: ChangeEvent<HTMLInputElement>, name: string)=>{
        setState({
            ...state,
            editData: {
                ...state.editData,
                [name]: e.target.type === "number" ? parseFloat(parseFloat(e.target.value).toFixed(2)): e.target.value
            }
        })
    }

    return (
        <tr>
            <td data-name="ClientName">
                {

                    state.edit ? (
                        <>
                            <input type="text" defaultValue={clientName} disabled />
                        </>
                    ) : (clientName)
                }
            </td>
            <td data-name="cc_type">
                {

                    state.edit ? (
                        <>
                            <input type="text" value={state.editData.cerdit_card_type} onChange={(e)=>handleChange(e, 'cerdit_card_type')}/>
                        </>
                    ) : (state.data.cerdit_card_type)
                }
            </td>
            <td data-name="cc_num">
                {

                    state.edit ? (
                        <>
                            <input type="text" value={state.editData.cerdit_card_number} onChange={(e)=>handleChange(e, 'cerdit_card_number')}/>
                        </>
                    ) : (state.data.cerdit_card_number)
                }
            </td>
            <td data-name="currency">
                {

                    state.edit ? (
                        <>
                            <input type="text" value={state.editData.currency} onChange={(e)=>handleChange(e, 'currency')}/>
                        </>
                    ) : (state.data.currency)
                }
            </td>
            <td data-name="total">
                {

                    state.edit ? (
                        <>
                            <input type="number" min="0.00" step="0.01" value={state.editData.total_price.toFixed(2)}  onChange={(e)=>handleChange(e, 'total_price')}/>
                        </>
                    ) : (state.data.total_price.toFixed(2))
                }
            </td>
            <td data-name="tools">
                {
                    state.edit ? (<>
                        <button onClick={
                            (e) => {
                                const el = (e.target as HTMLButtonElement);
                                if (el.getAttribute("disabled")) return alert("We are saving the data, plese wait")
                                el.classList.add("disabled");
                                el.setAttribute("disabled", "true");
                                setState({ ...state, save: true })

                                onEdit(state.editData as any)
                                    .catch(e => alert(e.message || "We had a problom Huston :("))
                                    .finally(() => {
                                        el.classList.remove("disabled");
                                        el.removeAttribute("disabled");
                                        setState({ ...state, save: false, edit: false, data: {...state.editData} })
                                    })
                            }
                        }>{state.save ? (<div className="loader">Saving...</div>) : "Save"}</button>
                        <button onClick={() => {
                            setState({ ...state, save: false, edit: false, editData: { ...data } });
                        }}>Cancel</button>
                    </>) : (<>
                        <button onClick={() => {
                            setState({ ...state, edit: true })
                        }}>Edit</button>
                        <button onClick={() => {
                            const ask = window.confirm("Are you sure you want to delete?")
                            if (ask) onDelete(data._id)
                        }}>Delete</button>
                    </>)
                }
            </td>
        </tr>
    )
}

export default Row;