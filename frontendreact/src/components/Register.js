import React, { useState } from 'react';
import apiService from '../apiServices';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = { email, password, role };

    apiService.createUser(userData)
      .then((response) => {
        console.log('Registration successful:', response.data);
        alert('Registration successful! Please log in.');
      })
      .catch((error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}>
      <h1 style={{
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        marginBottom: '20px',
      }}>
        Register
      </h1>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333',
        }}>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              marginTop: '5px',
              padding: '10px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </label>
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333',
        }}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              marginTop: '5px',
              padding: '10px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </label>
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333',
        }}>
          Role:
          <input
            disabled
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={{
              marginTop: '5px',
              padding: '10px',
              fontSize: '14px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#e9ecef',
              color: '#6c757d',
              cursor: 'not-allowed',
            }}
          />
        </label>
        <button type="submit" style={{
          padding: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: '#007BFF',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
