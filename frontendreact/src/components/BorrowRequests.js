import React, { useState, useEffect } from 'react';
import apiService from '../apiServices';

function BorrowRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    apiService.getBorrowHistory()
      .then((response) => setRequests(response?.data.filter((req) => req.status === 'pending')))
      .catch((error) => console.error('Failed to fetch requests:', error));
  }, []);

  const handleAction = (id, action) => {
    apiService.updateBorrowRequest(id, { status: action })
      .then(() => {
        setRequests(requests.filter((req) => req.id !== id));
      })
      .catch((error) => console.error(`Failed to ${action} request:`, error));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Borrow Requests</h1>
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
          <tr style={{ backgroundColor: '#565667', color: 'white', textAlign: 'left' }}>
          <th style={{ padding: '12px', border: '1px solid #ddd' }}>Req. ID</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Book Title</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Requested by</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Requested on</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Start Date</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>End Date</th>
            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests?.map((req, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f1f1f1',
                borderBottom: '1px solid #ddd',
              }}
            >
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{req.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{req.title}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{req.user_email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{req.created_at}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{req.start_date}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{req.end_date}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
              <button style={{ margin: '10px' }} onClick={() => handleAction(req.id, 'approved')}>Approve</button>
              <button style={{ margin: '10px' }} onClick={() => handleAction(req.id, 'denied')}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    // <div>
    //   <h1></h1>
    //   {requests?.map((req) => (
    //     <div key={req.id}>
    //       <h3>{req.title}</h3>
    //       <p>Requested by: {req.user_email}</p>
    //       <p>Requested on: {req.created_at}</p>
    //       <button onClick={() => handleAction(req.id, 'approved')}>Approve</button>
    //       <button onClick={() => handleAction(req.id, 'denied')}>Deny</button>
    //     </div>
    //   ))}
    // </div>
  );
}

export default BorrowRequests;
