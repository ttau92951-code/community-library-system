import React, { useContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import {
  LibraryProvider,
  LibraryContext
} from './context/LibraryContext';

import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import BookManagement from './pages/BookManagement';
import Transactions from './pages/Transactions';
import UserManagement from './pages/UserManagement';

function ProtectedRoute({ children }) {
  const { currentUser } = useContext(LibraryContext);

  return currentUser ? children : <Navigate to="/users" replace />;
}

function RoleProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useContext(LibraryContext);

  if (!currentUser) {
    return <Navigate to="/users" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <LibraryProvider>
      <BrowserRouter>
        <Navbar />

        <main>
          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/books"
              element={
                <RoleProtectedRoute
                  allowedRoles={['Admin', 'Librarian']}
                >
                  <BookManagement />
                </RoleProtectedRoute>
              }
            />

            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={<UserManagement />}
            />

          </Routes>
        </main>
      </BrowserRouter>
    </LibraryProvider>
  );
}
