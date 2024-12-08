import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import BorrowRequestForm from './components/BorrowRequestForm';
import BorrowHistory from './components/BorrowHistory';
import BorrowRequests from './components/BorrowRequests';
import AddBook from './components/AddBook';
import WelcomePage from './components/WelcomePage';
import apiService from './apiServices';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser({
      email: userData.email,
      role: userData.role,
      isLibrarian: userData.role === 'librarian',
    });
    return true;
  };

  const handleLogout = () => {
    apiService.logout()
      .then((response) => {
        setUser(null);
      })
    alert("Logged out Successfully...!")
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        {user ? (
          <Route path="/" element={<BookList user={user} />} />
        ) : (
          <Route path="/" element={<WelcomePage />} />
        )}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/borrow/:bookId" element={<BorrowRequestForm user={user} />} />
        <Route path="/librarian/borrow-history" element={<BorrowHistory user={user} />} />
        <Route path="/librarian/borrow-requests" element={<BorrowRequests />} />
        <Route path="/librarian/add-book" element={<AddBook />} />
      </Routes>
    </Router>
  );
}

export default App;
