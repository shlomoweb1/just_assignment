import { ChangeEvent, Dispatch, FormEvent, HTMLInputTypeAttribute, SetStateAction, useState } from "react";
import ClientAutoComplete, { transactionOption } from "../clients/ac";


interface FieldProp {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    title: string,
    type: HTMLInputTypeAttribute;
    id: string
}
const Field: React.FC<FieldProp> = ({ title, type, onChange, id }) => {
    return (
        <div className="form-group row mb-2">
            <label htmlFor={id} className="col-4 col-form-label">{title}</label>
            <div className="col-8">
                <input id={id} type={type} className="form-control" onChange={onChange} />
            </div>
        </div>)
}

interface iForm {
    client_id: any;
    cc_type: any;
    cc_number: any;
    currency: any;
    total: any;
}
type setStateForm = Dispatch<SetStateAction<{
    form: {
        client_id: any;
        cc_type: any;
        cc_number: any;
        currency: any;
        total: any;
    };
    invalid: boolean;
    touched: boolean;
}>>
const TransactionForm: React.FC<{onSubmit: (form: iForm, resetForm: ()=>void)=>void}> = ({onSubmit}) => {

    const [state, setState] = useState({
        form: {
            client_id: null as any,
            cc_type:  null as any,
            cc_number:  null as any,
            currency:  null as any,
            total:  null as any
        },
        invalid: true,
        touched: false
    })

    const resetForm = () =>{
        setState({
            form: {
                client_id: null as any,
                cc_type:  null as any,
                cc_number:  null as any,
                currency:  null as any,
                total:  null as any
            },
            invalid: true,
            touched: false
        })
    }

    const handleAc = (e: transactionOption) => {
        setState({...state, form: {...state.form, client_id: e._id}})
    }

    const handleField = (e:ChangeEvent<HTMLInputElement>, name: string)=>{
        setState({...state, form: {...state.form, [name]: e.target.value}})
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(Object.keys(state.form).filter((key)=>!(state.form as any)[key]).length )
            return setState({...state, invalid: true, touched: true});
            onSubmit(state.form, resetForm);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group row mb-2">
                <label className="col-4 col-form-label">Client</label>
                <div className="col-8">
                    <ClientAutoComplete onSelect={handleAc} />
                </div>
            </div>

            <Field title="CC type" type="text" id="transactionCCtype" onChange={(e) =>handleField(e, 'cc_type')} />
            <Field title="CC number" type="number" id="transactionCCnumber" onChange={(e) =>handleField(e, 'cc_number')} />
            <Field title="currency" type="string" id="transactionCurrency" onChange={(e) =>handleField(e, 'currency')} />
            <Field title="total" type="number" id="transactionTotal"  onChange={(e) =>handleField(e, 'total')}  />

            <div className="form-group row">
                <div className="offset-4 col-8">
                    <button name="submit" type="submit" className="btn btn-primary">Submit</button>
                </div>
            </div>
        </form>
    )
}

export default TransactionForm