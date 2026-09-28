import React, { useState, useContext } from 'react';
import { LibraryContext } from '../context/LibraryContext';

export default function UserManagement() {
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    currentUser,
    login,
    logout
  } = useContext(LibraryContext);

  const [loginId, setLoginId] = useState('');
  const [loginErr, setLoginErr] = useState('');

  const [signupData, setSignupData] = useState({
    name: '',
    membershipId: ''
  });

  const [signupErr, setSignupErr] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const initialUserState = {
    id: '',
    name: '',
    membershipId: '',
    role: 'Member'
  };

  const [userForm, setUserForm] = useState(initialUserState);
  const [isEditing, setIsEditing] = useState(false);
  const [adminErr, setAdminErr] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const res = login(loginId);

    if (!res.success) {
      setLoginErr(res.message);
    } else {
      setLoginErr('');
      setLoginId('');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();

    setSignupErr('');
    setSignupSuccess('');

    const name = signupData.name.trim();
    const membershipId = signupData.membershipId.trim();

    if (!name || !membershipId) {
      setSignupErr('Full Name and Membership ID are required.');
      return;
    }

    const exists = users.some(
      user =>
        user.membershipId.toLowerCase() ===
        membershipId.toLowerCase()
    );

    if (exists) {
      setSignupErr('Membership ID already exists.');
      return;
    }

    addUser({
      name,
      membershipId,
      role: 'Member'
    });

    setSignupData({
      name: '',
      membershipId: ''
    });

    setSignupSuccess(
      'Registration successful. You can now sign in using your Membership ID.'
    );
  };

  const handleUserFormSubmit = (e) => {
    e.preventDefault();

    if (!userForm.name || !userForm.membershipId) {
      setAdminErr(
        'Name and Membership ID are required.'
      );
      return;
    }

    if (isEditing) {
      updateUser(userForm);
      setIsEditing(false);
    } else {
      if (
        users.some(
          u =>
            u.membershipId.toLowerCase() ===
            userForm.membershipId.toLowerCase()
        )
      ) {
        setAdminErr(
          'Membership ID already exists.'
        );
        return;
      }

      addUser(userForm);
    }

    setUserForm(initialUserState);
    setAdminErr('');
  };

  const handleEditUser = (user) => {
    setUserForm(user);
    setIsEditing(true);
  };

  return (
    <div className="container">

      {/* Sign In */}
      <div className="card">
        <h3>Sign In</h3>

        {currentUser ? (
          <div style={{ marginTop: '0.5rem' }}>
            <p>
              Logged in as:{' '}
              <strong>{currentUser.name}</strong>{' '}
              ({currentUser.membershipId} - {currentUser.role})
            </p>

            <button
              style={{ marginTop: '0.5rem' }}
              className="btn btn-danger btn-sm"
              onClick={logout}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleLogin}
            style={{ maxWidth: '400px' }}
          >
            <div className="form-group">
              <label>Membership ID</label>

              <input
                placeholder="e.g. MEM002"
                value={loginId}
                onChange={(e) =>
                  setLoginId(e.target.value)
                }
              />

              {loginErr && (
                <span className="error-text">
                  {loginErr}
                </span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end'
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Sign Up */}
      {!currentUser && (
        <div className="card">
          <h3>Sign Up</h3>

          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}
          >
            Create a library membership account.
          </p>

          {signupErr && (
            <div
              className="error-text"
              style={{ marginTop: '0.75rem' }}
            >
              {signupErr}
            </div>
          )}

          {signupSuccess && (
            <div
              style={{
                color: 'var(--success)',
                marginTop: '0.75rem',
                fontSize: '0.85rem'
              }}
            >
              {signupSuccess}
            </div>
          )}

          <form onSubmit={handleSignup}>

            <div className="form-group">
              <label>Full Name</label>

              <input
                placeholder="e.g. Tau Tau"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    name: e.target.value
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Membership ID</label>

              <input
                placeholder="e.g. MEM003"
                value={signupData.membershipId}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    membershipId: e.target.value
                  })
                }
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end'
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
              >
                Sign Up
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Admin Management */}
      {currentUser?.role === 'Admin' && (
        <div className="card">

          <h3>Admin Management: User Directory</h3>

          {adminErr && (
            <div
              className="error-text"
              style={{ marginBottom: '0.5rem' }}
            >
              {adminErr}
            </div>
          )}

          <form onSubmit={handleUserFormSubmit}>

            <div className="form-group">
              <label>Full Name</label>

              <input
                name="name"
                value={userForm.name}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    name: e.target.value
                  })
                }
                placeholder="e.g. Tau Tau"
              />
            </div>

            <div className="form-group">
              <label>Membership ID</label>

              <input
                name="membershipId"
                value={userForm.membershipId}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    membershipId: e.target.value
                  })
                }
                placeholder="e.g. MEM003"
              />
            </div>

            <div className="form-group">
              <label>Role</label>

              <select
                name="role"
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    role: e.target.value
                  })
                }
              >
                <option value="Member">
                  Member
                </option>

                <option value="Librarian">
                  Librarian
                </option>

                <option value="Admin">
                  Admin
                </option>
              </select>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'flex-end'
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
              >
                {isEditing
                  ? 'Update User'
                  : 'Register User'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    setIsEditing(false);
                    setUserForm(initialUserState);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div
            className="table-responsive"
            style={{ marginTop: '1.5rem' }}
          >
            <table>

              <thead>
                <tr>
                  <th>Membership ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>

                    <td>
                      <strong>
                        {u.membershipId}
                      </strong>
                    </td>

                    <td>{u.name}</td>

                    <td>{u.role}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          handleEditUser(u)
                        }
                      >
                        Update
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          deleteUser(u.id)
                        }
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      )}

    </div>
  );
}