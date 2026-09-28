import React, { createContext, useState, useEffect } from 'react';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  // 1. Initial State from LocalStorage
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('library_books');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Clean Code', author: 'Robert C. Martin', genre: 'Technology', isbn: '9780132350884', quantity: 1 },
      { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Technology', isbn: '9780201616224', quantity: 5 },
      { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', isbn: '9780061120084', quantity: 0 }
    ];
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('library_users');
    return saved ? JSON.parse(saved) : [
      { id: 'u1', name: 'Admin Officer', membershipId: 'MEM001', role: 'Admin' },
      { id: 'u2', name: 'Alice Maseru', membershipId: 'MEM002', role: 'Member' }
    ];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('library_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('library_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // 2. Lifecycle Effects: Persist to localStorage
  useEffect(() => {
    localStorage.setItem('library_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('library_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('library_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('library_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // 3. Book Actions
  const addBook = (newBook) => {
    setBooks(prev => [...prev, { ...newBook, id: Date.now().toString(), quantity: Number(newBook.quantity) }]);
  };

  const updateBook = (updatedBook) => {
    setBooks(prev => prev.map(b => (b.id === updatedBook.id ? { ...updatedBook, quantity: Number(updatedBook.quantity) } : b)));
  };

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  // 4. Availability & Transaction Actions
  const handleStockTransaction = (bookId, type, qty, memberId) => {
    const amount = Number(qty);
    const book = books.find(b => b.id === bookId);
    if (!book) return { success: false, message: 'Book not found' };

    if (type === 'DEDUCT' && book.quantity < amount) {
      return { success: false, message: 'Insufficient stock available to borrow.' };
    }

    const updatedQty = type === 'ADD' ? book.quantity + amount : book.quantity - amount;

    // Update book stock
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, quantity: updatedQty } : b));

    // Record transaction
    const newTx = {
      id: Date.now().toString(),
      bookTitle: book.title,
      type: type === 'ADD' ? 'STOCK_ADDED' : 'BORROWED',
      quantity: amount,
      memberId: memberId || 'N/A',
      date: new Date().toLocaleString()
    };
    setTransactions(prev => [newTx, ...prev]);

    return { success: true };
  };

  // 5. User Management Actions
  const addUser = (user) => {
    setUsers(prev => [...prev, { ...user, id: Date.now().toString() }]);
  };

  const updateUser = (updatedUser) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const login = (membershipId) => {
    const found = users.find(u => u.membershipId.toLowerCase() === membershipId.trim().toLowerCase());
    if (found) {
      setCurrentUser(found);
      return { success: true };
    }
    return { success: false, message: 'Membership ID not recognized.' };
  };

  const logout = () => setCurrentUser(null);

  return (
    <LibraryContext.Provider value={{
      books, addBook, updateBook, deleteBook,
      users, addUser, updateUser, deleteUser,
      currentUser, login, logout,
      transactions, handleStockTransaction
    }}>
      {children}
    </LibraryContext.Provider>
  );
};
