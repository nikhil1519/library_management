import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav style={{
      backgroundColor: '#007BFF',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#ffffff' }}>Library</Link>
      </div>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        gap: '15px',
        margin: 0,
        padding: 0,
        alignItems: 'center',
      }}>
        <li>
          <Link to="/" style={{
            textDecoration: 'none',
            color: '#ffffff',
            fontWeight: 'bold',
            padding: '5px 10px',
          }}>
            Home
          </Link>
        </li>
        {user ? (
          <>
            {user.isLibrarian && (
              <>
                <li>
                  <Link to="/librarian/borrow-requests" style={{
                    textDecoration: 'none',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    padding: '5px 10px',
                  }}>
                    Manage Requests
                  </Link>
                </li>
                <li>
                  <Link to="/librarian/add-book" style={{
                    textDecoration: 'none',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    padding: '5px 10px',
                  }}>
                    Add Book
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/librarian/borrow-history" style={{
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '5px 10px',
              }}>
                Borrow History
              </Link>
            </li>
            <li>
              <button onClick={onLogout} style={{
                backgroundColor: '#ffffff',
                color: '#007BFF',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 10px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" style={{
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '5px 10px',
              }}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" style={{
                textDecoration: 'none',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '5px 10px',
              }}>
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
