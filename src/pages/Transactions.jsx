import React, { useState, useContext } from 'react';
import { LibraryContext } from '../context/LibraryContext';

export default function Transactions() {
  const { books, transactions, handleStockTransaction, users } = useContext(LibraryContext);

  const [bookId, setBookId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [actionType, setActionType] = useState('ADD');
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!bookId) {
      setMsg({ text: 'Please select a book.', type: 'danger' });
      return;
    }
    if (Number(quantity) <= 0) {
      setMsg({ text: 'Quantity must be at least 1.', type: 'danger' });
      return;
    }

    const res = handleStockTransaction(bookId, actionType, quantity, memberId);
    if (!res.success) {
      setMsg({ text: res.message, type: 'danger' });
    } else {
      setMsg({ text: `Successfully ${actionType === 'ADD' ? 'restocked' : 'borrowed'} ${quantity} unit(s).`, type: 'success' });
      setQuantity(1);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h3>Record Inventory Movement</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Add stock when shipments arrive or deduct stock when members borrow books.
        </p>

        {msg.text && (
          <p style={{ marginTop: '0.5rem', color: msg.type === 'danger' ? 'var(--danger)' : 'var(--success)' }}>
            {msg.text}
          </p>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Book</label>
            <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
              <option value="">-- Choose Book --</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.title} (In Stock: {b.quantity})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Action</label>
            <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
              <option value="ADD">Add Stock (Shipment Arrival)</option>
              <option value="DEDUCT">Deduct Stock (Borrow Book)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Member ID (Optional for restock)</label>
            <input placeholder="e.g. MEM002" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">Process Transaction</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Transaction History Log</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Book Title</th>
                <th>Units</th>
                <th>Member ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>
                    <span className={`badge ${tx.type === 'STOCK_ADDED' ? 'badge-in-stock' : 'badge-low-stock'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td><strong>{tx.bookTitle}</strong></td>
                  <td>{tx.quantity}</td>
                  <td>{tx.memberId}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}