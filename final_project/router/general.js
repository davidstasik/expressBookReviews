const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;

  // Note: I am assuming the authors of this final project mean that ISBN is the number in the books dict
  let book = books[isbn];

  if (book) {
    res.status(200).send(book);
  } else {
    res.status(404).json({ message: `No book with the ISBN "${isbn}" found.` });
  }
});

// Get book details based on author
// Note: Returns empty {} if no books found or author not found
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;

  let booksFromAuthor = {};

  // Obtaining all keys from books
  let keys = Object.keys(books);

  // Iterating through books and match with author
  keys.forEach((isbn) => {
    if (books[isbn].author === author) {
      booksFromAuthor[isbn] = books[isbn]; // Adding book to obj while keeping the ISBN
    }
  });

  res.status(200).json(booksFromAuthor);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
