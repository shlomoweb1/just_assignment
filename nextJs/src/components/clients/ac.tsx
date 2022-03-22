import { useState } from 'react';
import { AsyncTypeahead, Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import { SelectEvent } from 'react-bootstrap-typeahead/types/types';
import { clientAPI } from '../../api';
import { Document, Types} from 'mongoose'
import { Iclient } from '../../models/clients';

const CACHE: any = {};
const PER_PAGE = 20;

export type transactionOption = (Document<unknown, any, Iclient> & Iclient & {
    _id: Types.ObjectId;
})

const ClientAutoComplete: React.FC<{onSelect: (args0: transactionOption)=>void}> = ({onSelect}) => {
    const [state, setState] = useState({
        isLoading: false,
        options: [] as Array<transactionOption>
    })

    const handleSearch = (q: string, ...args: any[]) => {
        console.log(args);
        if(CACHE[q]) return setState({...state, options: CACHE[q].options})
        setState({...state, isLoading: true});
        clientAPI.get({filters:{q}}).then(res=>{
            CACHE[q] = { options: res.data.payload.items, page: 1 }
            setState({...state, ...{isLoading: false, options: res.data.payload.items}});
        })
    }
    const handlePagination = (event: SelectEvent<HTMLElement>, shownResults: number) => {}

    return (
        <AsyncTypeahead
            id="async-pagination-clients"
            isLoading={state.isLoading}
            maxResults={PER_PAGE}
            minLength={2}
            placeholder="Select a client"
            onSearch={handleSearch}
            onPaginate={handlePagination}
            options={state.options}
            paginate
            labelKey={(option) => `${(option as transactionOption).first_name} ${(option as transactionOption).last_name}`}
            renderMenuItemChildren={(option)=>{
                return (
                    <div key={(option as transactionOption)._id.toString()}>
                        {[(option as transactionOption).first_name, (option as transactionOption).last_name].join(" ")}
                    </div>
                )
            }}
            useCache={false}
            onChange={(selected)=>{
                const option = selected[0] as transactionOption;
                onSelect(option);
            }}
        />
    )
}

export default ClientAutoComplete;