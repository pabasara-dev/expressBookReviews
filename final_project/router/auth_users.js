const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// login eka daddi danna one 
let users = [{
  "username" :"adithya",
  "password":"123"  


}];
// You need to provide a manner in which it can be checked to see if the username exists in the list of registered users, to avoid duplications and keep the username unique. This is a utility function and not an endpoint.
const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}
// You will next check if the username and password match what you have in the list of registered users. It returns a boolean depending on whether the credentials match or not. This is also a utility function and not an endpoint.
const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });



  
// Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {

   
//   return res.status(300).json({message: "Yet to be implemented"});
// });

regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (username && isbn && review) {
    // Check if the user already has a review for the given ISBN
    const existingReviewIndex = users.findIndex(
      (user) => user.username === username 
    );

    if (existingReviewIndex !== -1) {
      // User already has a review, so modify the existing review
      books[isbn].reviews = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      // User does not have a review, so add a new review
      const userIndex = users.findIndex((user) => user.username === username);

      if (userIndex !== -1) {
        books[isbn] = review;
      } else {
        // Add a new user with the review
        const newUser = {
          username: username,
          reviews: { [isbn]: review },
        };
        users.push(newUser);
      }
      return res.status(200).json({ message: "Review posted successfully" });
    }
  } else {
    return res.status(400).json({ message: "Incomplete data provided" });
  }
});




// Complete the code for deleting a book isbn under


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  if (username && isbn) {
    // Find the user by username
    const userIndex = users.findIndex((user) => user.username === username);

    if (userIndex !== -1 && books[isbn].reviews) {
      // Delete the review for the given ISBN
      delete books[isbn];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } else {
    return res.status(400).json({ message: "Incomplete data provided" });
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
