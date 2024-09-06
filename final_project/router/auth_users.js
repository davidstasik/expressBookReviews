const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const isValid = (username) => {
  // Regular expression: allows only letters (uppercase and lowercase) and numbers
  const usernameRegex = /^[a-zA-Z0-9]+$/;

  if (!usernameRegex.test(username)) {
    return false;
  }

  // else: valid
  return true;
};

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validUsers.length > 0) {
    return true;
  } else return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  // Check if both username & password were provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Error: Please provide both username and password." });
  }

  // Authenticate user by credentials
  if (authenticatedUser(username, password)) {
    console.log("AUTHENTICATED!");

    // Generate JWT Token
    let token = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Store token and username in session
    req.session.authorization = {
      token,
      username,
    };

    return res.status(200).json({ message: "Login was successful." });
  } else {
    return res
      .status(401)
      .json({ message: "Invalid Login. Check username and password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.doesExist = doesExist;
module.exports.users = users;
