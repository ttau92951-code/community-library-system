
import React, { useContext } from 'react';
import { LibraryContext } from '../context/LibraryContext';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { books, transactions, users } = useContext(LibraryContext);

  const lowStockCount = books.filter(b => b.quantity < 2).length;
  const totalCopies = books.reduce((sum, b) => sum + Number(b.quantity), 0);

  return (
    <div className="container">
      <h2>System Overview</h2>
      <div className="grid-stats">
        <StatCard label="Total Titles" value={books.length} />
        <StatCard label="Total Copies in Stock" value={totalCopies} borderAccent="#10b981" />
        <StatCard label="Low Stock Titles (< 2)" value={lowStockCount} borderAccent="#ef4444" />
        <StatCard label="Registered Users" value={users.length} borderAccent="#f59e0b" />
      </div>

      <div className="card">
        <h3>Current Book Availability</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Items highlighted in red indicate critically low stock (fewer than 2 copies).
        </p>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Stock Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id} className={b.quantity < 2 ? 'highlight-row' : ''}>
                  <td><strong>{b.title}</strong></td>
                  <td>{b.author}</td>
                  <td>{b.genre}</td>
                  <td>{b.isbn}</td>
                  <td>{b.quantity}</td>
                  <td>
                    {b.quantity < 2 ? (
                      <span className="badge badge-low-stock">Low Stock</span>
                    ) : (
                      <span className="badge badge-in-stock">Available</span>
                    )}
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No books in inventory.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}