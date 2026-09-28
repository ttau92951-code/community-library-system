import React, { useState, useContext } from 'react';
import { LibraryContext } from '../context/LibraryContext';

export default function BookManagement() {
  const { books, addBook, updateBook, deleteBook } = useContext(LibraryContext);

  const initialForm = { id: '', title: '', author: '', genre: '', isbn: '', quantity: '' };
  const [formData, setFormData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.genre || !formData.isbn || formData.quantity === '') {
      setError('All fields are required.');
      return;
    }
    if (Number(formData.quantity) < 0) {
      setError('Quantity cannot be negative.');
      return;
    }

    if (isEditing) {
      updateBook(formData);
      setIsEditing(false);
    } else {
      addBook(formData);
    }
    setFormData(initialForm);
    setError('');
  };

  const handleEditClick = (book) => {
    setFormData(book);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="container">
      <div className="card">
        <h3>{isEditing ? 'Update Book Details' : 'Add New Book'}</h3>
        {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Design Patterns" />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input name="author" value={formData.author} onChange={handleChange} placeholder="e.g. Erich Gamma" />
          </div>
          <div className="form-group">
            <label>Genre</label>
            <input name="genre" value={formData.genre} onChange={handleChange} placeholder="e.g. Software Engineering" />
          </div>
          <div className="form-group">
            <label>ISBN</label>
            <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="e.g. 9780201633610" />
          </div>
          <div className="form-group">
            <label>Initial Quantity</label>
            <input type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Save Changes' : 'Add Book'}</button>
            {isEditing && <button type="button" onClick={handleCancel} className="btn btn-warning">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Book Inventory & Maintenance</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td><strong>{book.title}</strong></td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(book)}>Update</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteBook(book.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}