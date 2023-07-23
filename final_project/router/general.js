const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Function to check if a user already exists
function doesExist(username) {
  return users.some(user => user.username === username);
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }

  return res.status(400).json({ message: "Unable to register user." });
});



// Get the book list available in the shop
public_users.get('/',  (req, res) => {
  return res.send(  JSON.stringify(books)).status(200).json({message: "success"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',  (req, res) => {
  const isbn =req.params.isbn;
  const result = res.send( books[isbn]).status(200).json({message: "success"});
  if (result){
    return result
  } else {
      return res.send("data not found : []").status(200).json({message: "success"});
  }


 });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
  
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/author/:author',  (req, res) =>{
  const author = req.params.author;

  // Filter the book list by author
  const booksByAuthor = Object.values(books).filter(
    book => book.author === author
  );

  // Return the filtered book list
  return res.status(200).json({ books: booksByAuthor });
});


// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// this code also correct ............................................................
// public_users.get('/title/:title', function(req, res) {
//   const title = req.params.title;

//   // Filter the book list by title
//   const booksByTitle = Object.values(books).filter(book => book.title === title);

//   // Check if any books match the title
//   if (booksByTitle.length > 0) {
//     return res.status(200).json({ books: booksByTitle });
//   } else {
//     return res.status(404).json({ message: "No books found with the given title" });
//   }
// });
//...................................................................................................................
public_users.get('/title/:title',(req, res) =>{
const Title = req.params.title;

  const booksByTitle = Object.values(books).filter(
    book => book.title === Title
  );

  return res.status(200).json({ books: booksByTitle });
});





//  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/review/:isbn',(req, res) => {
const Isbn = req.params.isbn;

  const result = books[Isbn].reviews

  return res.status(200).json({ reviews: result });
});








module.exports.general = public_users;
