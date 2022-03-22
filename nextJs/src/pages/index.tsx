import type { NextPage } from 'next'
import { useState } from 'react';
import Modal from '../components/Modal';
import { transactionAPI } from '../api/index';
import { IgetResponse as ItransactionssResponse } from './api/transaction';
import TransactionsTable from '../components/transactions/listTbl';
import ReactPaginate from 'react-paginate';
import TransactionForm from '../components/transactions/new';




const Home: NextPage<{ transactions: ItransactionssResponse["payload"] }> = ({ transactions }) => {
  const [showModal, setShowModal] = useState(false);
  const [stateItems, setItems] = useState(transactions.items);

  const handlePageClick = ({ selected }: { selected: number }) => {
    console.log(`user selected page ${selected + 1}`)
    transactionAPI.get({ filters: { page: selected + 1 } }).then(res => {
      setItems(res.data.payload.items)
    })
  }

  const openModal = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowModal(true);
  }

  const NewTransactionBtn: React.FC = () => {
    return (
      <div className='d-md-flex justify-content-end'>
        <button onClick={openModal} className="btn btn-primary">New Transaction</button>
      </div>
    )
  }

  return (
    <div className='pt-md-4 container'>
      <NewTransactionBtn />
      <TransactionsTable {...transactions} items={stateItems} onEdit={(transaction) => {
        return transactionAPI.put(transaction)
      }} onDelete={(_id) => {
        transactionAPI.delete(_id).then(() => {
          const index = stateItems.findIndex(x => x._id === _id);
          const items = [...stateItems];
          items.splice(index, 1);
          setItems(items);
        }).catch(e => alert(e.message))
      }} />

      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={transactions.pages}
        previousLabel="< previous"
        renderOnZeroPageCount={() => null}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination justify-content-center"
        activeClassName="active"
      />

      <NewTransactionBtn />


      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="Create a transaction"
      >
        <TransactionForm onSubmit={(form, resetForm)=>{
          transactionAPI.post(form).then(()=>{
            resetForm();
            setShowModal(false);
          })
        }}/>
      </Modal>
    </div>
  )
}

Home.getInitialProps = async ({ query }) => {
  // const clients = await clientAPI.get({});
  const transactions = await transactionAPI.get({ filters: { page: query["transaction[page]"] as any, limit: query["transaction[limit]"] as any } })
  return { 
    // clients: clients.data.payload, 
    transactions: transactions.data.payload 
  }
}

export default Home
