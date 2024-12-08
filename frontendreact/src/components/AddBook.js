import React, { useState } from 'react';
import apiService from '../apiServices';

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBook = { title, author, publisher, quantity };
    apiService.createBook(newBook) 
      .then(() => {
        alert('Book added successfully...!');
        setTitle('');
        setAuthor('');
        setQuantity(1);
      })
      .catch((error) => console.error('Failed to add book:', error));
  };

  return (
    <div>
      <h1>Add New Book</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <br/>
        <label>
          Author:
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </label>
        <br/>
        <label>
          Publisher:
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            required
          />
        </label>
        <br></br>
        <label>
          quantity:
          <input
          type='number'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;
