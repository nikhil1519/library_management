import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../apiServices';

function BorrowRequestForm({ user }) {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const borrowRequest = {
      user_id: user.id,
      book_id: bookId,
      start_date: startDate,
      end_date: endDate,
    };

    apiService.createBorrowRequest(borrowRequest)
      .then((response) => {
        console.log('Request successful:', response.data);
        navigate('/');
      })
      .catch((error) => {
        console.error('Request failed:', error);
        alert('Failed to submit the request. Please try again.');
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
        Borrow Request
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
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default BorrowRequestForm;
