import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LibraryContext } from '../context/LibraryContext';

export default function Navbar() {
  const { currentUser, logout } = useContext(LibraryContext);

  return (
    <nav className="navbar">

      <div className="logo">
        COMMUNITY LIBRARY
      </div>

      <ul className="navbar-links">

        <li>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
        </li>

        {currentUser && (
          <li>
            <NavLink to="/transactions">
              Transactions
            </NavLink>
          </li>
        )}

        {currentUser &&
          (currentUser.role === 'Admin' ||
            currentUser.role === 'Librarian') && (
            <li>
              <NavLink to="/books">
                Book Management
              </NavLink>
            </li>
          )}

        <li>
          <NavLink to="/users">
            User Portal
          </NavLink>
        </li>

      </ul>

      <div>
        {currentUser ? (
          <span style={{ fontSize: '0.85rem' }}>
            Hi, <strong>{currentUser.name}</strong>{' '}
            ({currentUser.role}) |{' '}

            <button
              onClick={logout}
              className="btn btn-sm btn-danger"
            >
              Logout
            </button>
          </span>
        ) : (
          <span
            style={{
              fontSize: '0.85rem',
              color: '#94a3b8'
            }}
          >
            Guest
          </span>
        )}
      </div>

    </nav>
  );
}