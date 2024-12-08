import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px',
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        color: '#343a40',
        marginBottom: '20px',
      }}>
        Welcome to Our Library!
      </h1>
      <p style={{
        fontSize: '1.2rem',
        color: '#6c757d',
        marginBottom: '20px',
      }}>
        Please log in or register to explore our book collection.
      </p>
      <div style={{
        display: 'flex',
        gap: '15px',
      }}>
        <Link
          to="/login"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#ffffff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '16px',
          }}
        >
          Login
        </Link>
        <Link
          to="/register"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#ffffff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '16px',
          }}
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;
