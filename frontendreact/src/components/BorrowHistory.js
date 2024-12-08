import React, { useState, useEffect } from 'react';
import apiService from '../apiServices';

function BorrowHistory({user}) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    apiService.getBorrowHistory()
      .then((response) => {
        console.log(response.data);
        setHistory(response.data);
      })
      .catch((error) => console.error('Failed to fetch history:', error));
  }, []);

  // Function to export CSV generated from frontend
  const downloadCSV = () => {
    if (!history.length) {
      alert('No data available for download');
      return;
    }

    const headers = ['Book Title', 'Borrower', 'Request Date', 'Start Date', 'End Date', 'Status'];
    const rows = history.map((entry) => [
      entry.title,
      entry.user_email ? entry.user_email : 'self',
      entry.created_at,
      entry.start_date,
      entry.end_date,
      entry.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((value) => `"${value}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'borrow_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const downloadBackendCSV = () => {
    apiService
      .getBorrowHistory(true)
      .then((response) => {
        const blob = response.data; // Axios stores the blob data in `response.data`
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'borrow_history_backend.csv'); // Set file name
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Clean up
      })
      .catch((error) => {
        console.error('Error downloading backend CSV:', error);
      });
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Borrow History</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={downloadCSV}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Download CSV (Frontend)
        </button>
        <button
          onClick={downloadBackendCSV}
          style={{
            backgroundColor: '#007BFF',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Download CSV (Backend)
        </button>
      </div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '0 auto',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f9f9f9',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#007BFF', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Book Title</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Borrower</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Request Date</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Start Date</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>End Date</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {history?.map((entry, index) => (
            <tr
              key={entry.id}
              style={{
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f1f1f1',
                borderBottom: '1px solid #ddd',
              }}
            >
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.title}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.user_email === user.email ? 'self' : entry.user_email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.created_at}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.start_date}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.end_date}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BorrowHistory;
