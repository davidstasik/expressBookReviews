const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    res.status(400).json({
      message:
        "Invalid request: Both fields 'username' and 'password' are required to complete the registration.",
    });
  }

  // Check if username already exists
  if (doesExist(username)) {
    return res.status(409).json({
      message:
        "Conflict: A user with this username already exists. Please choose a different username.",
    });
  }

  // Check if username is valid
  if (!isValid(username)) {
    return res.status(400).json({
      message: "Invalid username: Only letters and numbers are allowed.",
    });
  }

  // If everything is fine, register the new user
  // in a real application this would be stored into a database with a hashed version of the password
  users.push({ username: username, password: password });
  console.log(users);

  return res
    .status(200)
    .json({ message: `The user '${username}' was registered successfully.` });
});

// // Task 1: Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 10: async equivalent to task 1:
// Note: axios is not needed here, see https://www.coursera.org/learn/developing-backend-apps-with-nodejs-and-express/discussions/weeks/4/threads/8CvLGlhKEe66bBLEH6-jOQ
public_users.get("/get-books-async", async function (req, res) {
  // Simulating an external data fetch that takes 3s
  const fetchBooks = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 3000);
    });
  };

  try {
    const fetchedBooks = await fetchBooks();
    return res.status(200).send(JSON.stringify(fetchedBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: `Error: Could not fetch books.` });
  }
});

// Task 2: Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;

  // Note: I am assuming the authors of this final project mean that ISBN is the number in the books dict
  let book = books[isbn];

  if (book) {
    return res.status(200).send(book);
  } else {
    return res
      .status(404)
      .json({ message: `No book with the ISBN "${isbn}" found.` });
  }
});

// Task 11: Async equivilent to task 2
public_users.get("/isbn-async/:isbn", async function (req, res) {
  // Simulating an external data fetch that takes 3s
  const fetchBookByIsbn = async (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error(`No book with the ISBN "${isbn}" found.`));
        }
      }, 3000);
    });
  };

  const isbn = req.params.isbn;

  try {
    const fetchedBook = await fetchBookByIsbn(isbn);
    return res.status(200).send(fetchedBook);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 3: Get book details based on author
// Note: Returns empty {} if no books found or author not found
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;

  let booksFromAuthor = {};

  // Obtaining all keys from books
  let keys = Object.keys(books);

  // Iterating through books and match with author
  keys.forEach((isbn) => {
    // Matching
    if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
      booksFromAuthor[isbn] = books[isbn]; // Adding book to obj while keeping the ISBN
    }
  });

  return res.status(200).json(booksFromAuthor);
});

// Task 12: Async equivalent to task 3
public_users.get("/author-async/:author", async function (req, res) {
  const fetchBooksByAuthor = async (author) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let booksFromAuthor = {};
        // Obtaining all keys from books
        let keys = Object.keys(books);

        // Iterating through books and match with author
        keys.forEach((isbn) => {
          // Matching
          if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
            booksFromAuthor[isbn] = books[isbn]; // Adding book to obj while keeping the ISBN
          }
        });

        resolve(booksFromAuthor);
      }, 3000);
    });
  };

  const author = req.params.author;

  try {
    const fetchedBooksFromAuthor = await fetchBooksByAuthor(author);
    return res.status(200).json(fetchedBooksFromAuthor);
  } catch (error) {
    return res.status(500).json({
      message: "Error: Could not fetch books by Author. || " + error.message,
    });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;

  let booksByTitle = {};

  // Obtaining all keys from books
  let keys = Object.keys(books);

  keys.forEach((isbn) => {
    // Matching
    if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
      booksByTitle[isbn] = books[isbn];
    }
  });

  return res.status(200).send(booksByTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;

  let book = books[isbn];

  if (book) {
    return res.status(200).send(book.reviews);
  } else {
    return res
      .status(404)
      .json({ message: `No book with the ISBN "${isbn}" found.` });
  }
});

module.exports.general = public_users;
