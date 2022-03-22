import { IgetResponse as IclientsResponse } from '../pages/api/clients';
const ClientTable: React.FunctionComponent<IclientsResponse["payload"]> = ({ items: clients }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Address</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody>
                {clients.map((client, index) => {
                    return (
                        <tr key={index + "_" + client._id}>
                            <td>{[client.first_name, client.last_name].join(" ")}</td>
                            <td>{client.email}</td>
                            <td>{client.gender}</td>
                            <td>{[client.street, client.city + ",", client.country].join(" ")}</td>
                            <td>{client.phone}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default ClientTable