# Unifit
CS35L Spring 2024 Final Project
- Selina Song, Fiona Peng, Aidan Van Duyne, Jack Deye, Clare Jin, Alyssa Leung

## Summary
Have you ever wondered why clothes are so expensive when you will get just a few uses out of them? Whether it is a nice suit needed for a presentation or a dress for a single night out with friends, uses for expensive clothes can be few and far between. 

Unifit: a platform that allows university students to effortlessly buy, sell, and rent clothes or other dorm necessities on campus without the hassle of shipping over an item from a stranger. Our goal is to fight against fast fashion, promote sustainability, and cultivate a close-knit community on university campuses. 
## Features
- User Authentication
  - After user logs in, they remain logged in for 1 hour then are automatically logged out for security.
- Gallery:
  - Filters: For Rent, For Buy, Posts from user's School, Fuzzy Find for searching through posts
- Profile
  - Upload profile picture, school, bio
  - Displays all purchased, rented posts, and user's own listings
  - When an item is purchased, the seller can Accept or Decline the purchase
    - If sold, post is greyed out and marked sold on profile
- Favorites
  - Displays all the posts a user has liked
- Product Page
  - Comments: Users submit comments for each post which are listed on ItemPage
  - Interactive Calendar for Rental Availability
    - On ItemPage, all available dates set by the post author are listed in green
    - Each time a date is rented out, it becomes unavailable in grey

## Technologies
- Frontend: React, Vite
- Backend: MongoDB, Node.js, Express

## Download the application
Clone the Repository:

```
git clone https://github.com/jackdeye/Unifit.git
cd Unifit
```

## Setup
### Backend Instructions
To set up the dependencies for the backend server, run:
```
cd Backend
npm install
```
Main backend dependencies:
- Express.js
  - Helps with routing, creating HTTP requests, parsing JSON and Form Data, error handling
- Multer
  - Used for handling file uploads in the backend, especially form data
  - Abstracts the complexity involved in handling file uploads, making it easier to integrate into Express routes
  - Handling images in backend:
    - Image file is converted to a Base64 string for storage in the database

- JWT (json web token) and Bcrypt
  - [MERN Auth Youtube Tutorial](https://youtu.be/LKlO8vLvUao?feature=shared)
  - [MERN User Auth Security](https://www.freecodecamp.org/news/how-to-secure-your-mern-stack-application/)
  - Bcrypt: Used to hash the password before being stored in the database with the user’s other details when signing up or signing in
  - JSON Web Tokens (JWT): Generated using the username and the user’s userID, which is signed with a secret key and set to expire in one hour. Used in the response to the client to use the token for authenticated requests.
  - Authentication middleware: Verifies the JWT token from incoming requests, extracts the user ID, and fetches the user's details from the database, ensuring only authenticated users can access protected routes.

- Local Storage
  - Used to store temporary data that is persistent across the webpage.
  - Features used for: Currently liked posts, Requesting posts, Buying posts, Renting, User attributes, URL Injection Protection

 To run, you must download the config.env file containing the MongoDB account login and the JWT web token.
 
### Running
```
cd Backend
npm start
```
## Frontend Instructions
### Setup
To setup the dependencies for the frontend application, run:
```
cd Frontend
npm install
```
Main frontend dependencies:
- React.js
- Vite
- react-router-dom: navigation between webpages
- react-datepicker: calendar and CSS for rental calendar
- Material UI
  - [MUI Tutorial](https://mui.com/material-ui/getting-started/)
### Running
To start the frontend application, run:
```
cd Frontend
npm run dev
```
The frontend will be available on http://localhost:5173

Once frontend and backend are running, the application will be fully usable
