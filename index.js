require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

app.post('/books', (req, res) => {
  const { title, author, description, categories, qty } = req.body;
  const query = 'INSERT INTO books (title, author, description, categories, qty, booked) VALUES (?, ?, ?, ?, ?, 0)';
  connection.query(query, [title, author, description, categories, qty], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Book added successfully!', bookId: results.insertId });
  });
});

app.get('/books', (req, res) => {
  const query = 'SELECT * FROM books';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM books WHERE idBook = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results[0]);
  });
});

app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, description, categories, qty, booked } = req.body;
  const query = 'UPDATE books SET title = ?, author = ?, description = ?, categories = ?, qty = ?, booked = ? WHERE idBook = ?';
  connection.query(query, [title, author, description, categories, qty, booked, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Book updated successfully!' });
  });
});

app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE idBook = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Book deleted successfully!' });
  });
});

app.post('/members', (req, res) => {
  const { name, phone, email, address } = req.body;
  const query = 'INSERT INTO members (name, phone, email, address) VALUES (?, ?, ?, ?)';
  connection.query(query, [name, phone, email, address], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Member added successfully!', memberId: results.insertId });
  });
});

app.get('/members', (req, res) => {
  const query = 'SELECT * FROM members';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

app.get('/members/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM members WHERE idMember = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results[0]);
  });
});

app.put('/members/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;
  const query = 'UPDATE members SET name = ?, phone = ?, email = ?, address = ? WHERE idMember = ?';
  connection.query(query, [name, phone, email, address, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Member updated successfully!' });
  });
});

app.delete('/members/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM members WHERE idMember = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Member deleted successfully!' });
  });
});

app.post('/transactions', (req, res) => {
  const { idMember, idBook, status } = req.body;
  const query = 'INSERT INTO transactions (date, idMember, idBook, status) VALUES (?, ?, ?, ?)';
  const now = new Date();
  connection.query(query, [now, idMember, idBook, status], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Transaction added successfully!', transactionId: results.insertId });
  });
});

app.get('/transactions', (req, res) => {
  const query = 'SELECT * FROM transactions';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

app.get('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM transactions WHERE idTransaction = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results[0]);
  });
});

app.put('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const { idMember, idBook, status } = req.body;
  const query = 'UPDATE transactions SET idMember = ?, idBook = ?, status = ? WHERE idTransaction = ?';
  connection.query(query, [idMember, idBook, status, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Transaction updated successfully!' });
  });
});

app.delete('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM transactions WHERE idTransaction = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Transaction deleted successfully!' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});