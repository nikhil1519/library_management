import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../apiServices';

function BookList({ user }) {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedAuthor, setUpdatedAuthor] = useState('');
  const [updatedPublisher, setUpdatedPublisher] = useState('');

  useEffect(() => {
    apiService.getBookList()
      .then((response) => setBooks(response.data))
      .catch((error) => console.error('Failed to fetch books:', error));
  }, []);

  const openUpdateModal = (book) => {
    setSelectedBook(book);
    setUpdatedTitle(book.title);
    setUpdatedAuthor(book.author);
    setUpdatedPublisher(book.publisher);
    setShowModal(true);
  };

  const closeUpdateModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const handleUpdate = () => {
    // Call your API to update the book
    apiService.updateBook(selectedBook.id, { title: updatedTitle, author: updatedAuthor, publisher: updatedPublisher })
      .then((response) => {
        setBooks(books.map(book => (book.id === selectedBook.id ? response.data : book)));
        closeUpdateModal();
      })
      .catch((error) => console.error('Failed to update book:', error));
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#343a40',
        marginBottom: '20px',
      }}>
        Book List
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
      }}>
        {books?.map((book) => (
          <div key={book.id} style={{
            border: '1px solid #ced4da',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <h3 style={{
              fontSize: '18px',
              color: '#007bff',
              marginBottom: '10px',
            }}>
              {book.title}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#495057',
              marginBottom: '15px',
            }}>
              <strong>Author:</strong> {book.author}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#495057',
              marginBottom: '15px',
            }}>
              <strong>Published By:</strong> {book.publisher}
            </p>
            {user ? (
              user.role === 'librarian' ? (
                <>
                  <Link to={`/view/${book.id}`} style={{
                    display: 'inline-block',
                    padding: '10px 15px',
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    marginRight: '10px',
                  }}>
                    View book
                  </Link>
                  <button
                    onClick={() => openUpdateModal(book)}
                    style={{
                      display: 'inline-block',
                      padding: '10px 15px',
                      backgroundColor: '#ffc107',
                      color: '#ffffff',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Update
                  </button>
                </>
              ) : (
                <Link to={`/borrow/${book.id}`} style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  backgroundColor: '#28a745',
                  color: '#ffffff',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}>
                  Borrow this book
                </Link>
              )
            ) : (
              <p style={{
                fontSize: '14px',
                color: '#dc3545',
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
                Please log in to borrow this book.
              </p>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Book</h2>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Author:</label>
              <input
                type="text"
                value={updatedAuthor}
                onChange={(e) => setUpdatedAuthor(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Publisher:</label>
              <input
                type="text"
                value={updatedPublisher}
                onChange={(e) => setUpdatedPublisher(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleUpdate}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#007bff',
                  color: '#ffffff',
                  borderRadius: '4px',
                  border: 'none',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Update
              </button>
              <button
                onClick={closeUpdateModal}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#dc3545',
                  color: '#ffffff',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookList;
