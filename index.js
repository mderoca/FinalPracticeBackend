const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;
const uri = "mongodb+srv://mvderoca:ImTryns24@cluster0.odhxgcg.mongodb.net/?retryWrites=true&w=majority";
// const uri = "mongodb://127.0.0.1:27017/BookList";

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use the cors middleware
app.use(cors());

// Define Book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
});

// Create Book model
const Book = mongoose.model('300329118-Marc', bookSchema);

app.use(express.json());

// Get all books
app.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Get single book by id
app.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching book' });
  }
});

// Add/save book
app.post('/', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) 
    {console.log(error + "HELLOO");
    res.status(400).json({ error: 'Error adding book' });
  }
});

// Update book by id
app.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: 'Error updating book' });
    console.log(res)
  }
});

// Delete book by id
app.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting book' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
