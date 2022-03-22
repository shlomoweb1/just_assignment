import type { NextPage } from 'next'
import { useState } from 'react';
import Modal from '../components/Modal';
import { clientAPI,  transactionAPI } from '../api/index';
import { IgetResponse as IclientsResponse } from './api/clients';
import { IgetResponse as ItransactionssResponse } from './api/transaction';
import TransactionsTable from '../components/transactions/listTbl';
// import ClientTable from '../components/clients';




const Home: NextPage<{ clients: IclientsResponse["payload"], transactions: ItransactionssResponse["payload"] }> = ({ children, clients, transactions }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <TransactionsTable {...transactions} onEdit={(transaction)=>{
        console.log(transaction);
        return new Promise((res)=>{
          setTimeout(()=>res(), 3000)
        })
      }} onDelete={(transaction)=>{console.log(transaction)}} />
      <button onClick={() => setShowModal(true)}>New Transaction</button>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
      >
      {/* <ClientTable {...clients} /> */}
        Hello from the modal!
      </Modal>
    </div>
  )
}

Home.getInitialProps = async ({ query }) => {
  // const page = parseInt(query.page as string || "1");
  // const limit = parseInt(query.limit as string || "20");
  console.log(query);
  const clients = await clientAPI.get({});
  const transactions = await transactionAPI.get({filters: {page: query["transaction[page]"] as any, limit: query["transaction[limit]"] as any}})
  return { clients: clients.data.payload, transactions: transactions.data.payload }
}

export default Home
